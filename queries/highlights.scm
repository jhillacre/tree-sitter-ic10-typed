; Comments
(comment) @comment

; Instructions and keywords
(opcode) @keyword
(keyword) @keyword

; Literals / constants
(enum) @constant.builtin
(constant) @constant.builtin
(integer) @number
(float) @number
(hex) @number

; Identifiers and variables
(identifier) @variable

; Labels
(label name: (identifier) @label)

; Macro-like forms: STR(...) and HASH("...")
(str argument: (_) @string)
(str keyword: (keyword) @keyword)
(hash argument: (_) @string)
(hash keyword: (keyword) @keyword)

; Registers (literal and indirection)
(register) @variable.builtin
(register_indirect) @variable.builtin

; Devices / endpoints
(device) @type
(device_indirect) @type
(network_endpoint) @type

; Branch targets (your grammar aliases this to integerish, but keeping a distinct style can be helpful)
(branch_target) @label

; Operators and punctuation
":" @punctuation.delimiter
"(" @punctuation.bracket
")" @punctuation.bracket
"$" @punctuation.special

; Special highlighting for built-in registers
((register) @constant.builtin
 (#match? @constant.builtin "^(sp|ra)$"))

((register_indirect) @constant.builtin
 (#match? @constant.builtin "^r(sp|ra)$"))

; Special highlighting for device bus
((device) @constant.builtin
 (#eq? @constant.builtin "db"))

; Errors
(ERROR) @error
