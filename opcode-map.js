const OPERAND_GROUPS = [
  {
    operands: ["reference", "numberish"],
    mnemonics: ["ABS", "ACOS", "ASIN", "ATAN", "CEIL", "COS", "EXP", "FLOOR", "LOG", "MOVE", "NOT", "ROUND", "SAPZ", "SEQZ", "SGEZ", "SGTZ", "SIN", "SLEZ", "SLTZ", "SNAN", "SNANZ", "SNAZ", "SNEZ", "SQRT", "TAN", "TRUNC"]
  },
  {
    operands: ["reference", "numberish", "numberish"],
    mnemonics: ["ADD", "AND", "ATAN2", "DIV", "MAX", "MIN", "MOD", "MUL", "NOR", "OR", "POW", "SEQ", "SGE", "SGT", "SLA", "SLE", "SLL", "SLT", "SNE", "SRA", "SRL", "SUB", "XOR"]
  },
  {
    operands: ["numberish", "branch_target"],
    mnemonics: ["BAPZ", "BAPZAL", "BEQZ", "BEQZAL", "BGEZ", "BGEZAL", "BGTZ", "BGTZAL", "BLEZ", "BLEZAL", "BLTZ", "BLTZAL", "BNAN", "BNAZ", "BNAZAL", "BNEZ", "BNEZAL"]
  },
  {
    operands: ["numberish", "numberish", "branch_target"],
    mnemonics: ["BEQ", "BEQAL", "BGE", "BGEAL", "BGT", "BGTAL", "BLE", "BLEAL", "BLT", "BLTAL", "BNE", "BNEAL"]
  },
  {
    operands: ["numberish", "lines"],
    mnemonics: ["BRAPZ", "BREQZ", "BRGEZ", "BRGTZ", "BRLEZ", "BRLTZ", "BRNAN", "BRNAN", "BRNAZ", "BRNEZ"]
  },
  {
    operands: ["numberish", "numberish", "lines"],
    mnemonics: ["BREQ", "BRGE", "BRGT", "BRLE", "BRLT", "BRNE"]
  },
  {
    operands: ["numberish", "numberish", "numberish", "branch_target"],
    mnemonics: ["BAP", "BAPAL", "BNA", "BNAAL"]
  },
  {
    operands: ["device_any", "branch_target"],
    mnemonics: ["BDNS", "BDNSAL", "BDSE", "BDSEAL"]
  },
  {
    operands: ["reference", "numberish", "numberish", "numberish"],
    mnemonics: ["LERP", "SAP", "SELECT", "SNA"]
  },
  {
    operands: ["reference"],
    mnemonics: ["PEEK", "POP", "RAND"]
  },
  {
    operands: ["device_any", "logic_type", "numberish"],
    mnemonics: ["BDNVL", "BDNVS"]
  },
  {
    operands: ["numberish", "numberish", "numberish", "lines"],
    mnemonics: ["BRAP", "BRNA"]
  },
  {
    operands: ["device_any", "lines"],
    mnemonics: ["BRDNS", "BRDSE"]
  },
  {
    operands: ["reference", "device_reference", "stack_index"],
    mnemonics: ["GETD"]
  },
  {
    operands: ["device_reference", "stack_index", "numberish"],
    mnemonics: ["PUTD"]
  },
  {
    operands: [],
    mnemonics: ["HCF", "YIELD"]
  },
  {
    operands: ["branch_target"],
    mnemonics: ["J", "JAL"]
  },
  {
    operands: ["numberish"],
    mnemonics: ["PUSH", "SLEEP"]
  },
  {
    operands: ["reference", "device_any"],
    mnemonics: ["SDNS", "SDSE"]
  },
  {
    operands: ["device_no_network"],
    mnemonics: ["CLR"]
  },
  {
    operands: ["device_reference"],
    mnemonics: ["CLRD"]
  },
  {
    operands: ["reference", "numberish", "offset", "length"],
    mnemonics: ["EXT"]
  },
  {
    operands: ["reference", "device_no_network", "numberish"],
    mnemonics: ["GET"]
  },
  {
    operands: ["reference", "offset", "length", "numberish"],
    mnemonics: ["INS"]
  },
  {
    operands: ["lines"],
    mnemonics: ["JR"]
  },
  {
    operands: ["reference", "device_any", "logic_type"],
    mnemonics: ["L"]
  },
  {
    operands: ["reference", "hashish", "logic_type", "batch_mode"],
    mnemonics: ["LB"]
  },
  {
    operands: ["reference", "hashish", "hashish", "logic_type", "batch_mode"],
    mnemonics: ["LBN"]
  },
  {
    operands: ["reference", "hashish", "hashish", "slot_index", "logic_slot_type", "batch_mode"],
    mnemonics: ["LBNS"] // There is no `SBNS` instruction
  },
  {
    operands: ["reference", "hashish", "slot_index", "logic_slot_type", "batch_mode"],
    mnemonics: ["LBS"]
  },
  {
    operands: ["reference", "device_reference", "logic_type"],
    mnemonics: ["LD"]
  },
  {
    operands: ["reference", "device_no_network", "reagent_mode", "hashish"],
    mnemonics: ["LR"]
  },
  {
    operands: ["reference", "device_no_network", "slot_index", "logic_slot_type"],
    mnemonics: ["LS"]
  },
  {
    operands: ["stack_index", "numberish"],
    mnemonics: ["POKE"]
  },
  {
    operands: ["device_no_network", "stack_index", "numberish"],
    mnemonics: ["PUT"]
  },
  {
    operands: ["reference", "device_no_network", "hashish"],
    mnemonics: ["RMAP"]
  },
  {
    operands: ["device_any", "logic_type", "numberish"],
    mnemonics: ["S"]
  },
  {
    operands: ["hashish", "logic_type", "reference"],
    mnemonics: ["SB"]
  },
  {
    operands: ["hashish", "hashish", "logic_type", "reference"],
    mnemonics: ["SBN"]
  },
  {
    operands: ["hashish", "slot_index", "logic_slot_type", "numberish"],
    mnemonics: ["SBS"]
  },
  {
    operands: ["device_reference", "logic_type", "reference"],
    mnemonics: ["SD"]
  },
  {
    operands: ["device_no_network", "slot_index", "logic_slot_type", "numberish"],
    mnemonics: ["SS"]
  },
  {
    operands: ["identifier", "alias_target"],
    mnemonics: ["ALIAS"]
  },
  {
    operands: ["identifier", "number_literal"],
    mnemonics: ["DEFINE"]
  }
];
exports.OPERAND_GROUPS = OPERAND_GROUPS;
