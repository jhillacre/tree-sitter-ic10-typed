// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterIc10Typed",
    products: [
        .library(name: "TreeSitterIc10Typed", targets: ["TreeSitterIc10Typed"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterIc10Typed",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterIc10TypedTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterIc10Typed",
            ],
            path: "bindings/swift/TreeSitterIc10TypedTests"
        )
    ],
    cLanguageStandard: .c11
)
