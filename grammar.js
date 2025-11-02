const { CONSTANTS, ENUM_MEMBERS, GLOBAL_ENUM_NAMESPACES } = require("./constants");
const { OPERAND_GROUPS } = require("./opcode-map");

// Function to create regex patterns for optional namespace prefixes
function createOptionalNamespacePatterns(enumMembers, globalNamespaces) {
  const patterns = [];
  
  for (const enumMember of enumMembers) {
    for (const namespace of globalNamespaces) {
      if (enumMember.startsWith(namespace + ".")) {
        const memberName = enumMember.substring(namespace.length + 1);
        // Create a regex pattern that makes the namespace optional
        // e.g., "LogicType.Power" becomes /(?:LogicType\.)?Power/i
        const escapedNamespace = escapeRegex(namespace);
        const escapedMember = escapeRegex(memberName);
        const pattern = new RegExp(`(?:${escapedNamespace}\\.)?${escapedMember}`, 'i');
        patterns.push({ pattern, enumMember, memberName });
      }
    }
  }
  
  return patterns;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function caseInsensitive(word) {
  return new RegExp(
    word
      .split("")
      .map(char => {
        if (/[a-zA-Z]/.test(char)) {
          const lower = char.toLowerCase();
          const upper = char.toUpperCase();
          return lower === upper ? escapeRegex(char) : `[${lower}${upper}]`;
        }
        return escapeRegex(char);
      })
      .join("")
  );
}

function mnemonicChoice($, mnemonics, nodeType) {
  return choice(...mnemonics.map(name =>
    alias(token(prec(2, caseInsensitive(name))), nodeType)
  ));
}

function operandTypeToRule($, type) {
  if (Array.isArray(type)) {
    return choice(...type.map(t => operandTypeToRule($, t)));
  }
  const ruleName = `${type}`;
  if (!$[ruleName]) {
    throw new Error(`Missing grammar rule: ${ruleName} for operand type: ${type}`);
  }
  return $[ruleName];
}

function createInstructionRule($, operandTypes, mnemonics) {
  const opcodeNode = mnemonicChoice($, mnemonics, $.opcode);

  if (operandTypes.length === 0) return seq(field("opcode", opcodeNode));
  const ops = operandTypes.map(t => field("operand", operandTypeToRule($, t)));
  return seq(field("opcode", opcodeNode), ...ops);
}

module.exports = grammar({
  name: "ic10",

  extras: $ => [/[\t \f]+/, $.comment],

  word: $ => $.identifier,

  rules: {
    // # Source File Structure #
    source_file: $ => seq(
      optional($.statement),
      repeat(seq($._line_break, optional($.statement)))
    ),

    _line_break: $ => /\r?\n/,

    // # Statement Types #
    statement: $ => choice(
      $.instruction,
      $.label
    ),

    label: $ => seq(field("name", $.identifier), ":"),

    // # Instructions #
    instruction: $ => choice(
      ...OPERAND_GROUPS.map(group =>
        createInstructionRule($, group.operands, group.mnemonics)
      )
    ),

    // # Comment #
    comment: $ => token(seq("#", /[^\r\n]*/)),

    // # Primatives, Globals, Macros #
    integer: $ => field('value', token(seq(
      optional(choice("+", "-")),
      /[0-9]+/
    ))),
    float: $ => field('value', token(seq(
      optional(choice("+", "-")),
      /[0-9]+\.[0-9]+/
    ))),
    hex: $ => seq(
      "$",
      field("value", token(/[0-9a-fA-F]+/))
    ),
    constant: $ => choice(
      ...CONSTANTS.map(name => token(caseInsensitive(name)))
    ),
    enum: $ => {
      const opt = createOptionalNamespacePatterns(ENUM_MEMBERS, GLOBAL_ENUM_NAMESPACES);
      const bare = ENUM_MEMBERS.filter(name => 
        !GLOBAL_ENUM_NAMESPACES.some(ns => name.startsWith(ns + "."))
      );
      return choice(
        // Bare enum members
        ...bare.map(name => alias(token(caseInsensitive(name)), "enum")),
        // Optional namespace patterns
        ...opt.map(({pattern}) => alias(token(pattern), "enum"))
      );
    },
    hash: $ => seq(
      field("keyword", alias(token(caseInsensitive("hash")), $.keyword)),
      "(",
      field("argument", /"[^"]*"/),
      ")"
    ),
    str: $ => seq(
      field("keyword", alias(token(caseInsensitive("str")), $.keyword)),
      "(",
      field("argument", /"[^"]*"/),
      ")"
    ),

    // Allow aliases/identifiers with the punctuation confirmed as valid in-game.
    identifier: $ => token(prec(0, /[a-zA-Z_][a-zA-Z0-9_@.$+=-]*/)),

    register: $ => token(prec(2, choice(
      caseInsensitive("sp"),
      caseInsensitive("ra"),
      seq(caseInsensitive("r"), /(?:1[0-5]|[0-9])/)
    ))),
    register_indirect: $ => token(prec(3, seq(
      caseInsensitive("r"),
      choice(
        caseInsensitive("sp"),
        caseInsensitive("ra"),
        seq(caseInsensitive("r"), /(?:1[0-5]|[0-9])/)
      )
    ))),
    device: $ => token(prec(2, choice(seq(caseInsensitive("d"), /[0-5]/), caseInsensitive("db")))),
    device_indirect: $ => token(prec(3, seq(
      caseInsensitive("d"),
      choice(
        caseInsensitive("sp"),
        caseInsensitive("ra"),
        seq(caseInsensitive("r"), /(?:1[0-5]|[0-9])/)
      )
    ))),
    network_endpoint: $ => seq(
      field('device', choice(
        $.device,
        $.device_indirect,
      )),
      ":",
      field('port', /[0-9]/) // enumerated physical connections (not TCP ports)
    ),

    // # Literals #
    integer_literal: $ => choice( // resolves to an integer value
      $.integer,
      $.hex,
      $.constant,
      $.enum,
      $.hash,
      $.str,
    ),
    number_literal: $ => choice( // superset of integer + things that resolve to floats
      $.integer_literal,
      $.float,
    ),
    register_literal: $ => choice(
      $.register,
      $.register_indirect,
    ),
    device_literal: $ => choice(
      $.device,
      $.device_indirect,
    ),

    // # Typed Operands #
    reference: $ => choice(
      $.register_literal,
      $.identifier,
    ),
    alias_target: $ => choice(
      $.device,
      $.register,
    ),

    // # Composite Operand Types #
    integerish: $ => choice(
      $.integer_literal,
      $.reference
    ),
    numberish: $ => choice(
      $.number_literal,
      $.reference
    ),
    device_any: $ => choice(
      $.device_literal,
      $.network_endpoint,
      $.device_reference
    ),
    device_no_network: $ => choice(
      $.device_literal,
      $.device_reference
    ),

    // semantically different but not technically different
    hashish: $ => $.integerish,
    branch_target: $ => $.integerish,
    device_reference: $ => $.integerish,
    variable_device: $ => $.integerish,
    logic_type: $ => $.integerish,
    logic_slot_type: $ => $.integerish,
    batch_mode: $ => $.integerish,
    reagent_mode: $ => $.integerish,
    stack_index: $ => $.integerish,
    offset: $ => $.integerish,
    length: $ => $.integerish,
    lines: $ => $.integerish,
    slot_index: $ => $.integerish,
  },
});
