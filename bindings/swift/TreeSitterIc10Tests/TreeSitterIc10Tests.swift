import XCTest
import SwiftTreeSitter
import TreeSitterIc10Typed

final class TreeSitterIc10TypedTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ic10())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading IC10 grammar")
    }
}
