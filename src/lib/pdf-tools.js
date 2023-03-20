import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

export const getPDFReadableStream = async (user) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  console.log("img url", user.image);
  const encodedImg = await imageToBase64(user.image);

  const docDefinition = {
    content: [
      {
        text: `${user.name} (${user.title})`,
        style: "header",
      },
      {
        image: `data:image/jpeg;base64, ${encodedImg}`,
        width: 150,
        style: "image",
      },
      {
        text: "Bio:",
        style: "sectionHeader",
      },
      {
        text: user.bio,
        style: "content",
      },
      {
        text: "Email:",
        style: "sectionHeader",
      },
      {
        text: user.email,
        style: "content",
      },
      {
        text: "Area:",
        style: "sectionHeader",
      },
      {
        text: user.area,
        style: "content",
      },
      {
        text: "Last Updated:",
        style: "sectionHeader",
      },
      {
        text: new Date(user.updatedAt).toLocaleDateString(),
        style: "content",
      },
    ],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        marginBottom: 20,
      },
      image: {
        marginTop: 20,
        marginBottom: 40,
      },
      subheader: {
        fontSize: 15,
        bold: true,
        marginBottom: 10,
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        marginTop: 20,
        marginBottom: 5,
      },
      content: {
        fontSize: 12,
        marginBottom: 10,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
