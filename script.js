const dataPasien = [];


const form = document.getElementById("formPasien");
const list = document.getElementById("listPasien");
const template = document.getElementById("templatePasien");
const total = document.getElementById("totalPasien");
const hariIni = document.getElementById("antrianHariIni");
const terakhir = document.getElementById("nomorTerakhir");
const menu = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");

// Format tanggal 
const formatTanggal = t => new Date(t).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
const formatJam = w => w.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

// buat qr jangan di ubah
const buatQr = p => {
  const isiQr = `${p.idPasien} | ${p.nama} | ${p.nomorAntrian} | ${p.rumahSakit} | ${p.dokter} | ${p.tanggalBerobat}`;
  return "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" + encodeURIComponent(isiQr);
};

// CARDDD WOY
function buatCard(p,i){
  const card = template.content.cloneNode(true);

  const isi = {
    ".nomor-antrian":p.nomorAntrian,
    ".nama-pasien":p.nama,
    ".kode-pasien":p.idPasien,
    ".rs-pasien":p.rumahSakit,
    ".dokter-pasien":p.dokter,
    ".tanggal-pasien":formatTanggal(p.tanggalBerobat),
    ".waktu-pasien":formatJam(new Date(p.waktuDaftar))
  };

  for(const k in isi) card.querySelector(k).textContent = isi[k];

  // Menambahkan QR pasien
  card.querySelector(".gambar-qr").src = buatQr(p);
  card.querySelector(".tombol-edit").dataset.index = i;
  card.querySelector(".tombol-hapus").dataset.index = i;

  return card;
}

// DATA
function tampilkanData(){
  list.innerHTML="";

  dataPasien.forEach((p,i)=>list.appendChild(buatCard(p,i)));

  const today = new Date().toISOString().split("T")[0];

  total.textContent = dataPasien.length;
  hariIni.textContent = dataPasien.filter(p=>p.tanggalBerobat===today).length;
  terakhir.textContent = dataPasien.at(-1)?.nomorAntrian || "-";
}



form.addEventListener("submit",e=>{
  e.preventDefault();

  // PASIENN BARUUUUWWW
  const pasien = {
    nama: nama.value.trim().toUpperCase(),
    rumahSakit: rs.value,
    dokter: dokter.value,
    tanggalBerobat: tanggal.value,
    idPasien:"MDC-"+Math.floor(Math.random()*90000+10000),
    nomorAntrian:"A-"+String(dataPasien.length+1).padStart(3,"0"),
    waktuDaftar:new Date()
  };

  dataPasien.push(pasien);
  tampilkanData();
  alert("Pendaftaran berhasil! Nomor antrian: "+pasien.nomorAntrian);
  form.reset();
});


// Menangani tombol edit dan hapus pada card
list.addEventListener("click",e=>{
  const btn = e.target.closest("button");
  if(!btn) return;

  const i = btn.dataset.index;
  if(i===undefined) return;

  const p = dataPasien[i];

  // Edit data pasien
  if(btn.classList.contains("tombol-edit")){
    const namaBaru = prompt("Edit nama pasien:",p.nama);
    const rsBaru = namaBaru===null?null:prompt("Edit rumah sakit / klinik:",p.rumahSakit);
    const dokterBaru = rsBaru===null?null:prompt("Edit dokter:",p.dokter);
    const tanggalBaru = dokterBaru===null?null:prompt("Edit tanggal berobat:",p.tanggalBerobat);

    if([namaBaru,rsBaru,dokterBaru,tanggalBaru].includes(null)) return;
    if(!namaBaru.trim()||!rsBaru.trim()||!dokterBaru.trim()||!tanggalBaru.trim()) return alert("Semua data edit harus diisi.");

    Object.assign(p,{
      nama:namaBaru.trim().toUpperCase(),
      rumahSakit:rsBaru.trim(),
      dokter:dokterBaru.trim(),
      tanggalBerobat:tanggalBaru.trim()
    });

    tampilkanData();
  }


  // Hapus data pasien
  if(btn.classList.contains("tombol-hapus")){
    if(!confirm("Yakin hapus data pasien ini?")) return;

    dataPasien.splice(i,1);


    // Nomor antrian disusun ulang
    dataPasien.forEach((p,i)=>p.nomorAntrian="A-"+String(i+1).padStart(3,"0"));
    tampilkanData();
  }
});

// Menu navbar untuk tampilan mobile
menu.onclick=()=>nav.classList.toggle("terbuka");
nav.onclick=e=>{if(e.target.tagName==="A")nav.classList.remove("terbuka")};

// Tampilkan data saat halaman pertama dibuka
tampilkanData();

