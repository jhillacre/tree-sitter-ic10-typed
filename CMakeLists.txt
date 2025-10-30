cmake_minimum_required(VERSION 3.13)

project(tree-sitter-ic10-type
        VERSION "1.0.0"
        DESCRIPTION "IC10 is the virtual embedded language in the game Stationeers used for automation and control systems."
        HOMEPAGE_URL "https://github.com/jhillacre/tree-sitter-ic10-type"
        LANGUAGES C)

option(BUILD_SHARED_LIBS "Build using shared libraries" ON)
option(TREE_SITTER_REUSE_ALLOCATOR "Reuse the library allocator" OFF)

set(TREE_SITTER_ABI_VERSION 15 CACHE STRING "Tree-sitter ABI version")
if(NOT ${TREE_SITTER_ABI_VERSION} MATCHES "^[0-9]+$")
    unset(TREE_SITTER_ABI_VERSION CACHE)
    message(FATAL_ERROR "TREE_SITTER_ABI_VERSION must be an integer")
endif()

include(GNUInstallDirs)

find_program(TREE_SITTER_CLI tree-sitter DOC "Tree-sitter CLI")

add_custom_command(OUTPUT "${CMAKE_CURRENT_SOURCE_DIR}/src/parser.c"
                   DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/src/grammar.json"
                   COMMAND "${TREE_SITTER_CLI}" generate src/grammar.json
                            --abi=${TREE_SITTER_ABI_VERSION}
                   WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
                   COMMENT "Generating parser.c")

add_library(tree-sitter-ic10-type src/parser.c)
if(EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/src/scanner.c)
  target_sources(tree-sitter-ic10-type PRIVATE src/scanner.c)
endif()
target_include_directories(tree-sitter-ic10-type
                           PRIVATE src
                           INTERFACE $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/bindings/c>
                                     $<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}>)

target_compile_definitions(tree-sitter-ic10-type PRIVATE
                           $<$<BOOL:${TREE_SITTER_REUSE_ALLOCATOR}>:TREE_SITTER_REUSE_ALLOCATOR>
                           $<$<CONFIG:Debug>:TREE_SITTER_DEBUG>)

set_target_properties(tree-sitter-ic10-type
                      PROPERTIES
                      C_STANDARD 11
                      POSITION_INDEPENDENT_CODE ON
                      SOVERSION "${TREE_SITTER_ABI_VERSION}.${PROJECT_VERSION_MAJOR}"
                      DEFINE_SYMBOL "")

configure_file(bindings/c/tree-sitter-ic10-type.pc.in
               "${CMAKE_CURRENT_BINARY_DIR}/tree-sitter-ic10-type.pc" @ONLY)

install(DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/bindings/c/tree_sitter"
        DESTINATION "${CMAKE_INSTALL_INCLUDEDIR}"
        FILES_MATCHING PATTERN "*.h")
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/tree-sitter-ic10-type.pc"
        DESTINATION "${CMAKE_INSTALL_LIBDIR}/pkgconfig")
install(TARGETS tree-sitter-ic10-type
        LIBRARY DESTINATION "${CMAKE_INSTALL_LIBDIR}")

file(GLOB QUERIES queries/*.scm)
install(FILES ${QUERIES}
        DESTINATION "${CMAKE_INSTALL_DATADIR}/tree-sitter/queries/ic10")

add_custom_target(ts-test "${TREE_SITTER_CLI}" test
                  WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
                  COMMENT "tree-sitter test")
