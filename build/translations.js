/* eslint-disable-next-line import/no-extraneous-dependencies */
require('dotenv').config();
const { exec } = require('child_process');

const readKey = process.env.LOCALAZY_READ_KEY;
const writeKey = process.env.LOCALAZY_WRITE_KEY;

exec(`yarn run localazy download -r ${readKey} -w ${writeKey}`, (_, stdout) => {
  const files = Array.from(stdout.matchAll(/^File: file\.js \[([a-z]+)]$/gm))
    .filter((match) => match[1] !== 'en');
  console.log(
    `Downloaded ${files.length} languages. [${files.map((match) => match[1]).join(', ')}]`,
  );
});
