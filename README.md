## Getting Started

Halo teman - teman semua, berikut tutorial untuk menjalakan aplikasi next jsnyaa

## Install Package Manager
Teman teman bisa install package manager nodejs dan npm disini yaaa https://nodejs.org/en/download

## Menjalankan aplikasi
- Clone terlebih dahulu github repository <br/>
``git clone https://github.com/PMK-Daniel``
- Buka folder project <br/>
``cd hology-client``
- Install package untuk kebutuhan aplikasi <br/>
``npm install``
- Selamat mengerjakan!!

## Penggunaan Script
- ``npm run dev`` ➡️ Menjalankan website dengan Next.js dan TurboPack
- ``npm run build:prod`` ➡️ Cek format kode pakai Prettier (tanpa ubah), lalu build
- ``npm run build:local`` ➡️ Rapihin dulu semua file, lalu build
- ``npm run lint`` ➡️ Cek semua file .js/.ts/.jsx/.tsx buat cari error style/kode
- ``npm run format`` ➡️ Cek format
- ``npm run format:fix`` ➡️ Auto rapihin semua file

## Penggunaan Nama Branch
Untuk nama branch harus menggunakan standar seperti berikut :
- ``(nama)-(tipe): (deskripsi)``

contoh : ``nopal-feat/navbar``

Setiap membuat fitur baru atau memperbaiki fitur harus menggunakan branch baru seperti SOP diatas dan melakukan pull request ke akuu (BangNopall) yaa

## Cara Commit / Push ke Github untuk Update Progresan
```c
- git add .
- git commit -m "feat: adding navbar section"
- git push origin nopal-feat/navbar
```
Harus menggunakan [`conventional commits`](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)! <br/>
dengan format ``tipe: deskripsi``

<h3>Berikut Tipenya</h3>

- API or UI relevant changes
    - `feat` Commits, that add or remove a new feature to the API or UI
    - `fix` Commits, that fix an API or UI bug of a preceded `feat` commit
- `refactor` Commits, that rewrite/restructure your code, however do not change any API or UI behaviour
    - `perf` Commits are special `refactor` commits, that improve performance
- `style` Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
- `test` Commits, that add missing tests or correcting existing tests
- `docs` Commits, that affect documentation only
- `build` Commits, that affect build components like build tools, dependencies, project version, ci pipelines, ...
- `ops` Commits, that affect operational components like infrastructure, deployment, backup, recovery, ...
- `chore` Miscellaneous commits e.g. modifying `.gitignore`

## Cara Pull / Mengambil Data Terbaru dari Github ke Lokal
```c
- git pull
- git pull origin (branch) // untuk pull dari branch lain
```