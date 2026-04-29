# Usage

First, clone the repository.
```
git clone https://github.com/rescuetycoon/risup.git
```

Decode preset:
```
node risup.js < preset.risup > preset.json
```

Decode module:
```
node risum.js < mod.risum > mod.json
```

If there is an assets embeded inside `mod.risum`, it will be extracted
to `./extracted_assets`.

# Contact

These scripts are only about 100 lines long and
straightforward. However, if you have any questions or need further
explanation about the formats, feel free to open a GitHub issue or
email me at twinings1008@proton.me.

# Copyright
```
Copyright 2026 rescuetycoon <twinings1008@proton.me>
Copyright 2024-2026 Kwaroran
Copyright 2019 The MessagePack Community
Copyright 2023 Arjun Barrett

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program. If not, see
<https://www.gnu.org/licenses/>.
```
