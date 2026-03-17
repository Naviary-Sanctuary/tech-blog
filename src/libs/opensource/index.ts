type OpenSource = {
  title: string;
  description: string;
  github: string;
  language: string;
  homepage?: string;
}

export const openSources: OpenSource[] = [
  {
    title: "kinship",
    description: "A TypeScript toolkit for modeling, validating, and querying pedigree DAGs with explainable diagnostics.",
    github: "https://github.com/naviary-sanctuary/kinship",
    language: "TypeScript",
  },
  {
    title: "schema-gen",
    description: "CLI tool to automatically generate validation schemas from class definitions",
    github: "https://github.com/naviary-sanctuary/schema-gen",
    language: "TypeScript",
  }, {
    title: "Naviary",
    description: "Multi paradigm programming language",
    github: "https://github.com/naviary-sanctuary/naviary",
    language: "Go",
  }
]