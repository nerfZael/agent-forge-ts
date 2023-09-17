export type MultipartData = {
  files: { [fieldName: string]: { filename: string; data: string } };
  fields: { [fieldName: string]: string };
};

export function processMultipartRequest(requestBody: string, boundary: string): MultipartData {
  const files: { [fieldName: string]: { filename: string; data: string } } = {};
  const fields: { [fieldName: string]: string } = {};

  const boundaryString = `--${boundary}`;
  const parts = requestBody.split(boundaryString).slice(1, -1);

  parts.forEach(part => {
    const [headerBlock, ...bodyParts] = part.split('\r\n\r\n');
    if (!headerBlock) return;

    const body = bodyParts.join('\r\n\r\n').trim();
    const headers = headerBlock.split('\r\n').reduce((headers, headerLine) => {
      const [name, value] = headerLine.split(': ');
      headers[name.toLowerCase()] = value;
      return headers;
    }, {} as { [headerName: string]: string });

    const contentDisposition = headers['content-disposition'];
    if (!contentDisposition) return;

    const fieldNameMatch = contentDisposition.match(/name="([^"]+)"/);
    const fieldName = fieldNameMatch ? fieldNameMatch[1] : null;

    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    const filename = filenameMatch ? filenameMatch[1] : null;

    if (fieldName) {
      if (filename) {
        files[fieldName] = { filename, data: body };
      } else {
        fields[fieldName] = body;
      }
    }
  });

  return { files, fields };
}