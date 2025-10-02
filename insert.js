import fs from "fs/promises";

(async () => {
  const data = (await fs.readFile("db/1600.txt", "utf-8"))
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
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiNTZjOWQzLTBlM2EtNDdkYS05MTE3LThkNzY3NmFjNzI5NiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTI2MTkyMCwiZXhwIjoxNzU5MjkwNzIwfQ.fxJ49EnG6raBkVlVDfYXWuz-VfGv8Mbs-Gf4mXfn2qM",
      },
      body: JSON.stringify({
        category_id: "d8182b33-845e-4ec3-a721-81e6ecb32d2c",
        valuation_class_id: "96f63777-cf52-4ba7-8594-1f0f09b49daa",
        material_id: dataArr[0],
        material_description: dataArr[1],
        satuan: dataArr[2],
        location: "Belum Ditentukan",
      }),
    });
    const resJson = await response.json();
    console.log(count + resJson.message);
    count++;
  }
})();
