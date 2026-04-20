import { program } from 'commander'

export const parseICLI = program
  .argument('<url>', 'URL you wish to scrape')
  .option('-c, --CDP [url]', 'Chrome Debugging URL', 'http://localhost:9222')
