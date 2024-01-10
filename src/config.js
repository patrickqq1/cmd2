const { exec } = require('child_process');
const path = require('path');
const fs = require('fs')

const lojas = {
  // PortodasDunas: {
  //   ip: "https://192.168.49.60/",
  //   user: "admin",
  //   password: "admin",
  // },
  // AracatiCentro: {
  //   ip: "https://192.168.48.60/",
  //   user: "admin",
  //   password: "admin",
  // },
  // Maranguape: {
  //   ip: "https://192.168.46.60/",
  //   user: "admin",
  //   password: "admin"
  // },
  // Quixeramobim: {
  //   ip: "https://192.168.47.60/",
  //   user: "admin",
  //   password: "admin"
  // },
  // Aquiraz: {
  //   ip: "https://192.168.44.60/",
  //   user: "admin",
  //   password: "admin"
  // },
  // RogacianoLeite: {
  //   ip: "https://192.168.41.60/",
  //   user: "admin",
  //   password: "admin"
  // },
  // Acarau: {
  //   ip: "https://192.168.32.60/",
  //   user: "admin",
  //   password: "admin",
  // },
  // Messejana: {
  //   ip: "https://192.168.19.60/",
  //   user: "admin",
  //   password: "admin",
  // },
  // Limoeiro: {
  //   ip: "https://192.168.15.60/",
  //   user: "admin",
  //   password: "admin",
  // },
  // AntonioSales: {
  //   ip: "https://192.168.40.60/",
  //   user: "admin",
  //   password: "as3266"
  // },
  // Praia: {
  //   ip: "https://192.168.39.60/",
  //   user: "admin",
  //   password: "monsenhor697",
  // },
  // Aracati: {
  //   ip: "https://192.168.29.60/",
  //   user: "admin",
  //   password: "1624alexandrino",
  // },
  // SobralCentro: {
  //   ip: "https://192.168.28.60/",
  //   user: "admin",
  //   password: "centro1462",
  // },
  // WS: {
  //   ip: "https://192.168.20.60/",
  //   user: "admin",
  //   password: "soares1381",
  // },
  // Itapipoca: {
  //   ip: "https://192.168.12.60/",
  //   user: "admin",
  //   password: "1039jose",
  // },
  SobralJunco: {
    ip: "https://192.168.8.60:1818/",
    user: "admin",
    password: "junco1800",
  },
  // Quixada: {
  //   ip: "https://192.168.7.60/",
  //   user: "admin",
  //   password: "admin",
  // },
  // Mondubim: {
  //   ip: "https://192.168.6.60/",
  //   user: "admin",
  //   password: "abc@123",
  // },
  // Panamericano: {
  //   ip: "https://192.168.1.60/",
  //   user: "admin",
  //   password: "pan1110",
  // },
  // bvp: {
  //   ip: "https://192.168.120.61/",
  //   user: "admin",
  //   password: "admin",
  // },
  // bvl: {
  //   ip: "https://192.168.120.60/",
  //   user: "admin",
  //   password: "admin",
  // },
};

const mapearPasta = async () => {
  exec(`sudo sh ${path.join(__dirname, "scripts", "mapear.sh")}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`erro ao executar arquivo ${error}`)
      console.error(`Saída de erro: ${stderr}`);
      return
    }
    console.log(`${stdout}`);
  })
}

const desmapearPasta = async () => {
  exec(`sudo sh ${path.join(__dirname, "scripts", "desmapear.sh")}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar umount: ${error}`);
      console.error(`Saída de erro: ${stderr}`);
      return;
    }
    console.log(`${stdout}`);
  });
};


module.exports = {
  downloadPath: path.join(__dirname, 'files'),
  mapearPasta,
  desmapearPasta,
  lojas
}