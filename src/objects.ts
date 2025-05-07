export class Char {
  public readonly origin: string;
  public readonly replaced: string;
  constructor(origin: string, replaced: string) {
    this.origin = origin;
    this.replaced = replaced;
  }
}

// The Dir class represents a directory
export class Dir {
  public readonly name: string;
  public readonly tree: Array<Dir | string>;
  constructor(name: string, tree: Array<Dir | string>) {
    this.name = name;
    this.tree = tree;
  }
}
