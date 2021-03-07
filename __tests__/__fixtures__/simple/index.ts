import { util } from "./moduleA";

export { util };

export class TestClass1 {
  private propPrivate: string;
  public propPublic: string;

  public getPublic() {
    return false;
  }

  private getPrivate() {
    return false;
  }

  protected getProtected() {
    return false;
  }

  get getterPublic() {
    return 1;
  }
  set setterPublic(value: string) {
    this.propPublic = value;
  }
}

export function exportedFn() {
  return 1;
}
