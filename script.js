// Array 
const dataPasien = [];
let indexEdit = null;

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

// STATUS ANTRIAN
const STATUSES = [
  { key: "menunggu",  label: "🕐 Menunggu",                      cls: "status-menunggu"  },
  { key: "dipanggil", label: "📢 Dipanggil",                     cls: "status-dipanggil" },
  { key: "telat",     label: "😅 Datang lagi esok hari (telat)", cls: "status-telat"     },
  { key: "selesai",   label: "✅ Selesai",                        cls: "status-selesai"   },
];

function getStatusIdx(idPasien) {
  return parseInt(localStorage.getItem("status_" + idPasien) || "0");
}

function setStatusIdx(idPasien, idx) {
  localStorage.setItem("status_" + idPasien, idx);
}

function buatBadgeStatus(idPasien) {
  const btn = document.createElement("button");
  btn.className = "status-badge";

  function render() {
    const s = STATUSES[getStatusIdx(idPasien)];
    btn.className = "status-badge " + s.cls;
    btn.textContent = s.label;
  }

  btn.addEventListener("click", e => {
    e.stopPropagation(); 
    const next = (getStatusIdx(idPasien) + 1) % STATUSES.length;
    setStatusIdx(idPasien, next);
    render();
  });

  render();
  return btn;
}

// BUATTT QR ( JGN DI UBAHH )
const buatQr = p => {
  const isiQr =
    `${p.idPasien} || ${p.nama} || ${p.nomorAntrian} || ${p.rumahSakit} || ${p.dokter} || ${p.tanggalBerobat}`

  return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&ecc=H&data=" 
         + encodeURIComponent(isiQr);
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

  // BADGE STATUS 
  const namaPasienEl = card.querySelector(".nama-pasien");
  namaPasienEl.after(buatBadgeStatus(p.idPasien));

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
form.addEventListener("submit", e => {
  e.preventDefault();

  const pasien = {
    nama: nama.value.trim().toUpperCase(),
    rumahSakit: rs.value,
    dokter: dokter.value,
    tanggalBerobat: tanggal.value,
    idPasien: "MDC-" + Math.floor(Math.random()*90000+10000),
    waktuDaftar: new Date()
  };

  if(indexEdit !== null){

    // UPDATE DATA
    pasien.nomorAntrian = dataPasien[indexEdit].nomorAntrian;
    pasien.idPasien = dataPasien[indexEdit].idPasien;
    pasien.waktuDaftar = dataPasien[indexEdit].waktuDaftar;

    dataPasien[indexEdit] = pasien;
    indexEdit = null;
    alert("Data berhasil diupdate!");
  } else {

    // TAMBAH DATA
    pasien.nomorAntrian = "A-" + String(dataPasien.length+1).padStart(3,"0");
    dataPasien.push(pasien);
    alert("Pendaftaran berhasil! Nomor antrian: " + pasien.nomorAntrian);
  }

  tampilkanData();
  form.reset();
});

// Event DOM 
list.addEventListener("click",e=>{
  const btn = e.target.closest("button");
  if(!btn) return;

  const i = btn.dataset.index;
  if(i===undefined) return;

  const p = dataPasien[i];

  //  EDITTT DATAAAAAAAAAAAA
  if(btn.classList.contains("tombol-edit")){
    const p = dataPasien[i];

    nama.value = p.nama;
    rs.value = p.rumahSakit;
    dokter.value = p.dokter;
    tanggal.value = p.tanggalBerobat;

    indexEdit = i;

    form.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
    nama.focus();
  }

  //confirm() sebelum hapus
  if(btn.classList.contains("tombol-hapus")){
    if(!confirm("Yakin hapus data pasien ini?")) return; // Kotak Dialog confirm()

    // Hapus status dari localStorage sekalian
    localStorage.removeItem("status_" + dataPasien[i].idPasien);

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