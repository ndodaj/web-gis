export class TypescriptUtils {
  public static downloadFile(
    body: Blob,
    fileName: string,
    contentType: string
  ) {
    const file = new Blob([body], {
      type: contentType
    });
    const element = document.createElement('a');
    const objUrl = URL.createObjectURL(file);
    element.href = objUrl;
    element.download = fileName as string;
    document.body.appendChild(element);
    element.click();
    URL.revokeObjectURL(objUrl);
    element.remove();
  }

  public static removeDuplicatesFromArray<T>(listaInput: Array<T>): Array<T> {
    return listaInput.filter(
      (value: T, index: number, array: Array<T>) =>
        array.indexOf(value) === index
    );
  }
}
