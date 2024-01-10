const puppeteer = require('puppeteer');
const { downloadPath, mapearPasta, desmapearPasta, lojas } = require("./config");
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const db = require("./db")

const downloadFile = async (url, user, password) => {
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: false, args: ['--no-sandbox'] });
  const page = await browser.newPage({
    timeout: 100000,
  });
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: `${downloadPath}/`,
  })
  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector("#input_user");
  await page.type("#input_user", user);
  await page.waitForSelector("#input_password");
  await page.type("#input_password", password);
  await page.waitForSelector("#logar");
  await page.click("#logar");
  await page.waitForTimeout(5000);
  await page.waitForXPath('//*[@id="MasterPage_menu"]/div/ul/li[4]/a/span[1]');
  const span = await page.$x('//*[@id="MasterPage_menu"]/div/ul/li[4]/a/span[1]');
  await span[0].evaluate(e => e.click());
  await page.waitForXPath('//*[@id="MasterPage_menu"]/div/ul/li[4]/ul/li[3]/a')
  const anchor = await page.$x('//*[@id="MasterPage_menu"]/div/ul/li[4]/ul/li[3]/a');
  await anchor[0].evaluate(e => e.click());

  const formatedDate = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    date.setDate(date.getDate() - 10);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}${mes}${ano}`;
  };
  await page.waitForTimeout(5000)
  const inputValue = await page.$eval('#initial_date', el => el.value)
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  await page.waitForTimeout(5000)
  await page.type("#initial_date", formatedDate());
  const elements3 = await page.$x('//*[@id="MasterConteudo"]/div[3]/div/div[3]/button[2]')
  if (elements3[0]) {
    await elements3[0].evaluate((b) => b.click())
  }
  await page.waitForTimeout(5000)
  await browser.close()
};

const downloadFileNew = async (url) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox'] 
  });
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: `${downloadPath}/`,
  })
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);
  await page.waitForSelector("#input_user");
  await page.type("#input_user", "admin");
  await page.waitForSelector("#input_password");
  await page.type("#input_password", "admin");
  await page.waitForSelector("#logar");
  await page.click("#logar");
  await page.waitForTimeout(5000)
  await page.waitForXPath('//*[@id="MasterPage_menu"]/div/ul/li[4]/a');
  const elements1 = await page.$x('//*[@id="MasterPage_menu"]/div/ul/li[4]/a');
  await elements1[0].evaluate((b) => b.click());
  await page.waitForXPath('//*[@id="MasterPage_menu"]/div/ul/li[4]/ul/li[3]/a');
  const elements2 = await page.$x(
    '//*[@id="MasterPage_menu"]/div/ul/li[4]/ul/li[3]/a'
  );
  await elements2[0].evaluate((b) => b.click());
  const formatedDate = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    date.setDate(date.getDate() - 10)
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}${mes}${ano}`;
  };
  console.log(formatedDate())
  await page.waitForTimeout(5000)
  const inputValue = await page.$eval('#initial_date', el => el.value)
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  await page.waitForTimeout(5000)
  await page.type("#initial_date", formatedDate());
  const elements3 = await page.$x('//*[@id="MasterConteudo"]/div[3]/div/div[3]/button[2]')
  if (elements3[0]) {
    await elements3[0].evaluate((b) => b.click())
  }
  await page.waitForTimeout(5000)
  await browser.close()
}


const genFileAndCopy = async () => {
  await mapearPasta();
  if (!fs.existsSync(downloadPath)) {
    console.log('A pasta ' + downloadPath + ' não existe, criando... ')
    fs.mkdirSync(`${downloadPath}/`)
  } else {
    console.log('A pasta ' + downloadPath + ' existe, apagando... ')
    fs.rmSync(path.resolve(__dirname, "files"), { recursive: true })
    console.log('A pasta ' + downloadPath + ' foi apagada, criando... ')
    fs.mkdirSync(`${downloadPath}/`)
  }
  const formatarDataeHora = () => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = String(data.getFullYear()).slice(-2)
    const hora = String(data.getHours()).padStart(2, '0')
    const minuto = String(data.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${ano} - ${hora}:${minuto}`
  }

   for (const file in lojas) {
     const url = lojas[file].ip;
     const user = lojas[file].user;
     const password = lojas[file].password;
     console.log("inciando em " + formatarDataeHora() + " na loja " + file)
     var success = false;
     var retries = 0;
     while (!success && retries < 3) {
       try {
         (retries > 0) ? console.log(`Tentativa ${retries + 1} de download...`) : console.log(`Tentativa de download...`);
         await downloadFile(url, user, password);
         success = true;
         const files = fs.readdirSync(downloadPath);
         if (files.length === 0) throw new Error("Nenhum arquivo encontrado");
         console.log(files[0]);
         if (success) {
           fs.copyFileSync(path.join(downloadPath, files[0]), `/mnt/dmrep/${(file).toUpperCase()}.txt`);
           fs.rmSync(path.join(downloadPath, files[0]));
         }
        } catch (err) {
          console.log(`Erro de download: ${err.message}`);
          await db("pontosp").insert({
            DESC_ITEM: `ponto ${file}`,
            DATE_ITEM: new Date().toISOString().split("T")[0],
            TIME_ITEM: (() => {
              const today = new Date();
              const hours = today.getHours();
              const minutes = today.getMinutes();
              const seconds = today.getSeconds();
              console.log(`${hours}:${minutes}:${seconds}`);
              return `${hours}:${minutes}:${seconds}`;
            })(),
            STATUS: false
          })
          success = false;
          retries++;
        }
        if(success){
        await db("pontosp").insert({
         DESC_ITEM: `ponto ${file}`,
         DATE_ITEM: new Date().toISOString().split("T")[0],
         TIME_ITEM: (() => {
           const today = new Date();
           const hours = today.getHours();
           const minutes = today.getMinutes();
           const seconds = today.getSeconds();
           console.log(`${hours}:${minutes}:${seconds}`);
           return `${hours}:${minutes}:${seconds}`;
         })(),
         STATUS: true
       })}
      }
    }
  const newPoints = {
    OPEN7: {
      name: "open7",
      ip: "https://192.168.10.188/",
      path: "/mnt/dmrep/OPEN7.txt"
    },
    TEA: {
      name: "tea",
      ip: "https://192.168.10.190/",
      path: "/mnt/dmrep/T&A.txt"
    },
    MARAPONGA: {
      name: "maraponga",
      ip: "https://192.168.3.60/",
      path: "/mnt/dmrep/MARAPONGA.txt"
    },
    TIANGUÁ: {
      name: "tiangua",
      ip: "https://192.168.50.60/",
      path: "/mnt/dmrep/TIANGUA.txt"
    },
    CAMBEBA: {
      name: "cambeba",
      ip: "https://192.168.51.60/",
      path: "/mnt/dmrep/CAMBEBA.txt"
    },
    PREA: {
      name: "prea",
      ip: "https://192.168.52.60/",
      path: "/mnt/dmrep/CAMBEBA.txt"
    }
  }
  const newpointsdown = Object.keys(newPoints)
  for(const stoores of newpointsdown){
    try{
      console.log(`Iniciando exportação do ponto da ${newPoints[stoores].name} do dia ${formatarDataeHora()}`)
    await downloadFileNew(newPoints[stoores].ip)
    const [files] = fs.readdirSync(downloadPath)
    console.log(files)
    if(!files) throw new Error("Nenhum arquivo encontrado!")
    fs.copyFileSync(path.resolve(downloadPath, files), newPoints[stoores].path)
    fs.rmSync(path.join(downloadPath, files))
    await db("pontosp").insert({
      DESC_ITEM: `ponto ${newPoints[stoores].name}`,
      DATE_ITEM: new Date().toISOString().split("T")[0],
      TIME_ITEM: (() => {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        console.log(`${hours}:${minutes}:${seconds}`);
        return `${hours}:${minutes}:${seconds}`;
      })(),
      STATUS: true
    })
  }catch(error){
    console.error(error)
    await db("pontosp").insert({
      DESC_ITEM: `ponto ${newPoints[stoores].name}`,
      DATE_ITEM: new Date().toISOString().split("T")[0],
      TIME_ITEM: (() => {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        console.log(`${hours}:${minutes}:${seconds}`);
        return `${hours}:${minutes}:${seconds}`;
      })(),
      STATUS: false
    })
  }
  }
  console.log(`APAGANDO ARQUIVOS...`);
  fs.rmSync(path.resolve(__dirname, "files"), { recursive: true });
  await desmapearPasta();
}

const cronSheet = () => {
  console.log(`CRON INICIADO...`);
  cron.schedule('50 22 * * *', async () => {
    console.log(`INICIANDO EXPORTAÇÃO DO PONTO...`);
    console.log(`CRON FINALIZADO...`);
  })
}

cronSheet()
genFileAndCopy().then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
});