# priconne-diff

## Information
This repository serves formatted files containing information from multiple regions of `master.db` from the game `Princess Connect! Re:Dive`.

Updating is done automatically through Github Actions. Updates will be checked every hour.

## Supported Regions
| Region               | `.csv` files   | `.md` table files  | `.json` files    |
| :------------------: | :------------: | :----------------: | :--------------: |
| [China (CN)](CN/)    | [csv](CN/csv/) | [table](CN/table/) | [json](CN/json/) |
| [English (EN)](EN/)  | [csv](EN/csv/) | [table](EN/table/) | [json](EN/json/) |
| [Japan (JP)](JP/)    | [csv](JP/csv/) | [table](JP/table/) | [json](JP/json/) |
| [Korea (KR)](KR/)    | [csv](KR/csv/) | [table](KR/table/) | [json](KR/json/) |
| [Taiwan (TW)](TW/)   | [csv](TW/csv/) | [table](TW/table/) | [json](TW/json/) |
| [Thailand (TH)](TH/) | [csv](TH/csv/) | [table](TH/table/) | [json](TH/json/) |

## File Types
Different file types are offered depending on preference and if GitHub can render something or not.

### Comma-Seperated Values (`.csv`)
  - Data can be searched/filtered via GitHub's provided search bar.
  - Prone to GitHub rendering issues.

### Markdown (`.md`) with data formatted as a table
  - More stable than `.csv`.
  - Content can not be searched through easily.
  - GitHub refuses to render large tables.

### JavaScript Object Notation (`.json`)
  - Column names are right next to values.
  - Data isn't displayed pretty.
  - Can not see column names if no table entry exists.
  - Most likely not effected by GitHub's rendering.

## Database Files
The `.db` files used for this project is served from `expugn/priconne-database`:<br/>
<https://github.com/Expugn/priconne-database>

## Other Stuff
This is a non-profit fan project with the purpose of practice and entertainment.<br/>
All assets belong to their respective owners.

**Project** began on June 3, 2023.