// ARRAY
let dataPasien = []

// FUNCTION TAMBAH DATA
function tambahPasien(nama,rs,dokter,tanggal){

// OBJECT DATE
let waktu = new Date()

// OBJECT MATH
let id = Math.floor(Math.random()*10000)

// NOMOR ANTRIAN
let nomor = "A-"+(dataPasien.length+1)

// OBJECT STRING
nama = nama.toUpperCase()

let pasien = {
id:id,
nama:nama,
rs:rs,
dokter:dokter,
tanggal:tanggal,
nomor:nomor,
waktu:waktu
}

dataPasien.push(pasien)

tampilkan()

alert("Berhasil daftar! Nomor antrian: "+nomor)

}


// TAMPILKAN DATA
function tampilkan(){

let container = document.getElementById("listPasien")

container.innerHTML=""

dataPasien.forEach((p,index)=>{

container.innerHTML+=`
<div class="card">
<h3>${p.nama}</h3>
<p><b>Klinik:</b> ${p.rs}</p>
<p><b>Dokter:</b> ${p.dokter}</p>
<p><b>Tanggal:</b> ${p.tanggal}</p>
<p><b>Antrian:</b> ${p.nomor}</p>

<button onclick="editPasien(${index})">Edit</button>
<button onclick="hapusPasien(${index})">Hapus</button>

</div>
`

})

}


// EDIT
function editPasien(index){

let namaBaru = prompt("Edit Nama", dataPasien[index].nama)

if(namaBaru){

dataPasien[index].nama = namaBaru.toUpperCase()

tampilkan()

}

}


// DELETE
function hapusPasien(index){

let yakin = confirm("Yakin hapus data?")

if(yakin){

dataPasien.splice(index,1)

tampilkan()

}

}


// EVENT DOM
document.getElementById("formPasien")
.addEventListener("submit",function(e){

e.preventDefault()

let nama = document.getElementById("nama").value
let rs = document.getElementById("rs").value
let dokter = document.getElementById("dokter").value
let tanggal = document.getElementById("tanggal").value

tambahPasien(nama,rs,dokter,tanggal)

this.reset()

})
