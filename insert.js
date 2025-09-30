import fs from "fs/promises";

(async () => {
  const data = (await fs.readFile("db/4400.txt", "utf-8"))
    .trim()
    .split("\n")
    .map((d) => d.trim());
  let count = 1;
  for (const d of data) {
    const dataArr = d.split("|");
    const response = await fetch(`https://minamas.jteck.net/api/materials`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlmMWRiN2Y5LTdjZjktNDE2OS1hMDhmLWJlODM2OGEwNmQ5NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTA3MzQxNCwiZXhwIjoxNzU5MTAyMjE0fQ.8gL7tUMa2C92q6TG8Zy-0DPBagbmiKucTunxnrL8C9g",
      },
      body: JSON.stringify({
        category_id: "1166cf43-6137-4239-b718-d68b3627f790",
        material_id: dataArr[0],
        material_description: dataArr[1],
        satuan: dataArr[2],
      }),
    });
    const resJson = await response.json();
    console.log(count + resJson.message);
    count++;
  }
})();
