const fs = require('fs');

const filePath = 'C:\\Users\\Shrut Sharma\\Desktop\\passiton\\lib\\indian-colleges.ts';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const collegeArray = data.match(/export const FAMOUS_INDIAN_COLLEGES = ([\s\S]*?);/)[1];
    const colleges = collegeArray.split('\n').filter(line => line.includes('"')).map(line => line.trim().replace(/,$/, '').replace(/"/g, ''));
    const uniqueColleges = [...new Set(colleges)];

    const newFileContent = `export const FAMOUS_INDIAN_COLLEGES = [\n${uniqueColleges.map(c => `  "${c}"`).join(',\n')}\n];\n\n// Function to search colleges based on input\nexport const searchColleges = (query: string): string[] => {
  if (!query || query.length < 2) return [];

  const lowercaseQuery = query.toLowerCase();

  return FAMOUS_INDIAN_COLLEGES.filter(college =>
    college.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 10); // Limit to 10 suggestions
};

// Function to get all colleges (for reference)
export const getAllColleges = (): string[] => {
  return FAMOUS_INDIAN_COLLEGES.sort();
};
`;

    fs.writeFile(filePath, newFileContent, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File has been fixed!');
    });
});
