<h1 align="center"> Labpro Single Service </h1>

<p align="center">Author: Akbar Maulana Ridho (13521093)</p>

## Languages, Libraries and Tech Stack

- NestJS Framework
- Drizzle ORM
- Typescript
- Zod Validation Schema
- Swagger

## Running The App

```bash
$ docker compose up
```

## Design Pattern

### Decorator Pattern

Digunakan untuk melakukan penambahan (extension) fungsionalitas dari suatu objek atau fungsi. Pattern ini banyak digunakan pada project ini, terlebih lagi mengingat NestJS banyak menyediakan wrapepr utility yang salah satunya berupa decorator yang sudah siap digunakan. Penggunaan decorator mempermudah saya untuk menambah fungsionalitas method/ class tanpa mengorbankan readability.

### Dependency Injection

Digunakan agar project ini bisa terpisah-pisah menjadi modul yang mudah dibongkar pasang dan mempermudah pengaturan dependency suatu kelas. Selain itu, kelas yang membutuhkan suatu dependency tidak perlu pusing untuk memikirkan bagaimana cara membuat dan mengatur lifecycle kelas tersebut.

### Interceptor Pattern

Digunakan untuk melakukan transformasi HTTP response dari controller sebelum menuju user. Perhatikan bahwa bentuk response pada setiap endpoint sama sehingga kita bisa mengurangi repetisi untuk membentuk response yang sama dengan menulis sebuah interceptor sehingga bentuk responsenya bisa sama pada setiap endpoint.


## Endpoint

Sesuai dengan API contract, dengan API akan mengembalikan status 400 pada endpoint GET by id, UPDATE, dan DELETE bila model yang berkaitan tidak ditemukan (bukan return null)

## Bonus

### Single Service Implementation

Typescript and Zod is the king.

### Dokumentasi APi

Tersedia pada endpoint /api. Dokumentasi swagger langsung digenerate dari annotation pada setiap controller dan tipenya di-infer dari skema database. Drizzle terintegrasi dengan Zod, yang terintegrasi dengan NestJS, yang terintegrasi dengan Swagger.

### SOLID

Cukup jelas bila memperhatikan folder structure dan isi kodenya.