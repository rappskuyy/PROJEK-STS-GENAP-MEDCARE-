// Array 
const dataPasien = [];

// 
const form = document.getElementById("formPasien");
const list = document.getElementById("listPasien");
const template = document.getElementById("templatePasien");
const total = document.getElementById("totalPasien");
const hariIni = document.getElementById("antrianHariIni");
const terakhir = document.getElementById("nomorTerakhir");
const menu = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");

// Object Date
const formatTanggal = t => new Date(t).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
const formatJam = w => w.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

// Function
const buatQr = p => {
  const isiQr = `${p.idPasien} | ${p.nama} | ${p.nomorAntrian} | ${p.rumahSakit} | ${p.dokter} | ${p.tanggalBerobat}`;
  return "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" + encodeURIComponent(isiQr);
};

// CARDDDD
function buatCard(p,i){
  const card = template.content.cloneNode(true);

  const isi = {
    ".nomor-antrian":p.nomorAntrian,
    ".nama-pasien":p.nama,
    ".kode-pasien":p.idPasien,
    ".rs-pasien":p.rumahSakit,
    ".dokter-pasien":p.dokter,
    ".tanggal-pasien":formatTanggal(p.tanggalBerobat),
    ".waktu-pasien":formatJam(new Date(p.waktuDaftar)) // Object Date
  };

  for(const k in isi) card.querySelector(k).textContent = isi[k];

  // QR
  card.querySelector(".gambar-qr").src = buatQr(p);
  card.querySelector(".tombol-edit").dataset.index = i;
  card.querySelector(".tombol-hapus").dataset.index = i;

  return card;
}

// DATAAAA
function tampilkanData(){
  list.innerHTML="";

  dataPasien.forEach((p,i)=>list.appendChild(buatCard(p,i)));

  const today = new Date().toISOString().split("T")[0]; // Object Date

  total.textContent = dataPasien.length;
  hariIni.textContent = dataPasien.filter(p=>p.tanggalBerobat===today).length;
  terakhir.textContent = dataPasien.at(-1)?.nomorAntrian || "-";
}

// Event DOM 
form.addEventListener("submit",e=>{
  e.preventDefault();

  // Object pasien 
  const pasien = {
    nama: nama.value.trim().toUpperCase(), // Object String
    rumahSakit: rs.value,
    dokter: dokter.value,
    tanggalBerobat: tanggal.value,
    idPasien:"MDC-"+Math.floor(Math.random()*90000+10000), // Object Math
    nomorAntrian:"A-"+String(dataPasien.length+1).padStart(3,"0"), // Object String
    waktuDaftar:new Date() // Object Date
  };

  dataPasien.push(pasien);
  tampilkanData();
  alert("Pendaftaran berhasil! Nomor antrian: "+pasien.nomorAntrian); //alert()
  form.reset();
});

// Event DOM 
list.addEventListener("click",e=>{
  const btn = e.target.closest("button");
  if(!btn) return;

  const i = btn.dataset.index;
  if(i===undefined) return;

  const p = dataPasien[i];

  // prompt() EDITTT DATAAAAAAAAAAAA
  if(btn.classList.contains("tombol-edit")){
    const namaBaru = prompt("Edit nama pasien:",p.nama);
    const rsBaru = namaBaru===null?null:prompt("Edit rumah sakit / klinik:",p.rumahSakit);
    const dokterBaru = rsBaru===null?null:prompt("Edit dokter:",p.dokter);
    const tanggalBaru = dokterBaru===null?null:prompt("Edit tanggal berobat:",p.tanggalBerobat);

    if([namaBaru,rsBaru,dokterBaru,tanggalBaru].includes(null)) return;
    if(!namaBaru.trim()||!rsBaru.trim()||!dokterBaru.trim()||!tanggalBaru.trim()) return alert("Semua data edit harus diisi.");

    Object.assign(p,{
      nama:namaBaru.trim().toUpperCase(), // Object String
      rumahSakit:rsBaru.trim(),
      dokter:dokterBaru.trim(),
      tanggalBerobat:tanggalBaru.trim()
    });

    tampilkanData();
  }

  //confirm() sebelum hapus
  if(btn.classList.contains("tombol-hapus")){
    if(!confirm("Yakin hapus data pasien ini?")) return; // Kotak Dialog confirm()

    dataPasien.splice(i,1);

    // RISETTTT ANTRIANN
    dataPasien.forEach((p,i)=>p.nomorAntrian="A-"+String(i+1).padStart(3,"0"));
    tampilkanData();
  }
});

// HAMBURGERRR
menu.onclick=()=>nav.classList.toggle("terbuka");
nav.onclick=e=>{if(e.target.tagName==="A")nav.classList.remove("terbuka")};

// NAMPIL DATA PAS BARU DI BUKA
tampilkanData();