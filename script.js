const pages=[...document.querySelectorAll('.panel')], navButtons=[...document.querySelectorAll('nav button')];
const done=new Set(); let blinkTimer=null, blinkOn=false;
function openPage(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));navButtons.forEach(b=>b.classList.toggle('active',b.dataset.page===id));window.scrollTo({top:0,behavior:'smooth'});}
navButtons.forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.page)));
function startLearning(){const n=document.getElementById('studentName').value.trim();if(!n){document.getElementById('welcome').textContent='Silakan isi nama terlebih dahulu.';return;}document.getElementById('welcome').textContent=`Selamat belajar, ${n}! Isilah setiap aktivitas secara berurutan.`;markDone('home');}
function markDone(id){done.add(id);const count=Math.min(done.size,8);document.getElementById('progressbar').style.width=(count/8*100)+'%';document.getElementById('progressText').textContent=`${count} dari 8 aktivitas ditandai selesai.`;}
function notify(s){alert(s)}
function showFlow(which){const d={input:'INPUT: sensor atau tombol memberikan data/keadaan yang dibaca oleh sistem.',process:'PROSES: mikrokontroler menjalankan instruksi program dan menentukan tindakan.',output:'OUTPUT: hasil pemrosesan mengendalikan perangkat seperti LED, buzzer, atau motor.'};document.getElementById('flowExplain').textContent=d[which];}
const pinDetails={
'ATmega328P':'Mikrokontroler utama pada Arduino Uno R3 standar. Menjalankan program yang diunggah ke papan.',
'USB':'Menghubungkan papan dengan komputer untuk pemrograman dan komunikasi serial; juga dapat memasok daya sesuai kondisi.',
'Jack DC':'Masukan daya eksternal yang sesuai spesifikasi papan. Perhatikan rentang tegangan yang dianjurkan.',
'Pin digital':'Pin digital dapat dikonfigurasi sebagai input atau output. Pin 0 dan 1 juga digunakan untuk komunikasi serial.',
'Pin PWM':'Pin bertanda ~ mendukung keluaran PWM pada Uno R3 standar. PWM bukan keluaran tegangan analog sejati.',
'Pin analog':'A0–A5 dapat membaca tegangan analog melalui ADC; rentang yang aman mengikuti spesifikasi papan.',
'5V / 3.3V':'Pin catu daya untuk rangkaian sesuai kemampuan arus dan spesifikasi papan.',
'GND':'Ground atau titik referensi bersama rangkaian.',
'VIN':'Pin untuk masukan tegangan ke rangkaian regulator pada konfigurasi yang sesuai; bukan pin output 5V.',
'RESET':'Memulai ulang program pada mikrokontroler.',
'LED daya':'Indikator bahwa papan menerima daya.',
'LED pin 13':'LED bawaan Uno R3 standar terhubung ke pin digital 13.'
};
function pinButton(name,detail){const b=document.createElement('button');b.className='pin';b.textContent=name;b.onclick=()=>{document.getElementById('pinInfo').innerHTML=`<b>${name}</b><p>${detail}</p>`};return b;}
const top=document.getElementById('topPins'),bottom=document.getElementById('bottomPins');
['D0 RX','D1 TX','D2','D3 ~','D4','D5 ~','D6 ~','D7'].forEach(n=>top.appendChild(pinButton(n,pinDetails[n.includes('~')?'Pin PWM':'Pin digital'])));
['D8','D9 ~','D10 ~','D11 ~','D12','D13 LED','A0','A1','A2','A3','A4','A5'].forEach(n=>bottom.appendChild(pinButton(n,n.includes('A')?pinDetails['Pin analog']:(n.includes('~')?pinDetails['Pin PWM']:(n.includes('13')?pinDetails['LED pin 13']:pinDetails['Pin digital'])))));
function toggleBoardLed(){document.getElementById('boardLed').classList.toggle('on')}
function setLed(id,on){document.getElementById(id).classList.toggle('on',on)}
function startBlink(){stopBlink();blinkOn=false;const tick=()=>{blinkOn=!blinkOn;setLed('blinkLed',blinkOn);document.getElementById('blinkStatus').textContent='LED: '+(blinkOn?'MENYALA (HIGH)':'MATI (LOW)');document.getElementById('blinkExplain').textContent=blinkOn?'digitalWrite(13, HIGH): LED menyala.':'digitalWrite(13, LOW): LED mati.';};tick();blinkTimer=setInterval(tick,Number(document.getElementById('interval').value));markDone('simulasi');}
function stopBlink(){if(blinkTimer){clearInterval(blinkTimer);blinkTimer=null;}document.getElementById('blinkExplain').textContent='Simulasi dihentikan.'}
function resetBlink(){stopBlink();blinkOn=false;setLed('blinkLed',false);document.getElementById('blinkStatus').textContent='LED: MATI';document.getElementById('blinkExplain').textContent='Simulasi direset.'}
function restartBlinkIfRunning(){if(blinkTimer)startBlink()}
function buttonInput(on){document.getElementById('buttonState').textContent=on?'HIGH':'LOW';document.getElementById('buttonLedText').textContent=on?'MENYALA':'MATI';setLed('buttonLed',on)}
function updateLight(){const v=Number(document.getElementById('lightSlider').value),on=v<30;document.getElementById('lightValue').textContent=v;document.getElementById('lightState').textContent=on?'Gelap':'Terang';document.getElementById('lightLedText').textContent=on?'MENYALA':'MATI';setLed('lightLed',on)}
const starterCode=`const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`;
function resetCode(){document.getElementById('codeEditor').value=starterCode;document.getElementById('codeResult').textContent='Kode awal dipulihkan.'}
function checkCode(){const c=document.getElementById('codeEditor').value,issues=[];if(!c.includes('void setup()'))issues.push('Bagian void setup() tidak ditemukan.');if(!c.includes('void loop()'))issues.push('Bagian void loop() tidak ditemukan.');if(!c.includes('pinMode')||!c.includes('OUTPUT'))issues.push('Periksa konfigurasi pin sebagai OUTPUT.');if(!c.includes('digitalWrite')||!c.includes('HIGH')||!c.includes('LOW'))issues.push('Periksa perintah HIGH dan LOW untuk mengendalikan LED.');if(!c.includes('delay'))issues.push('Tidak ditemukan delay(); tambahkan jeda jika ingin LED berkedip dengan interval tertentu.');document.getElementById('codeResult').innerHTML=issues.length?'<b>Perlu diperiksa:</b><ul>'+issues.map(x=>'<li>'+x+'</li>').join('')+'</ul><small>Ini pemeriksaan pola sederhana, bukan kompilasi.</small>':'<b>Struktur dasar terdeteksi.</b><p>Program tampak memiliki setup, loop, konfigurasi output, serta perintah HIGH/LOW. Periksa kembali sintaks dan unggah melalui Arduino IDE untuk pengujian nyata.</p>'}
function runCodeDemo(){openPage('simulasi');startBlink()}
const questions=[
{q:'Apa fungsi utama mikrokontroler pada Arduino Uno?',o:['Menampilkan dokumen seperti komputer desktop','Menjalankan program untuk membaca input dan mengendalikan output','Menggantikan semua sensor','Menyediakan koneksi internet otomatis','Menyimpan semua file sekolah'],a:1,e:'Mikrokontroler menjalankan instruksi program dan mengolah sinyal input untuk mengendalikan output.'},
{q:'Komponen utama Arduino Uno R3 standar adalah…',o:['ATmega328P','Intel Core i7','Raspberry Pi OS','GPU diskret','Hard disk mekanis'],a:0,e:'Arduino Uno R3 standar menggunakan mikrokontroler ATmega328P.'},
{q:'Pin yang dapat digunakan untuk membaca tegangan analog pada Uno R3 adalah…',o:['A0–A5','HDD1–HDD6','TX0–TX5 saja','GND saja','USB saja'],a:0,e:'Pin A0 sampai A5 menyediakan masukan analog melalui ADC.'},
{q:'Apa fungsi setup() dalam program Arduino?',o:['Berjalan terus tanpa henti','Dijalankan sekali saat program mulai atau reset','Mematikan mikrokontroler','Menghapus kode','Mengatur resolusi monitor'],a:1,e:'setup() digunakan untuk inisialisasi, misalnya mengatur pin sebagai OUTPUT.'},
{q:'Perintah digitalWrite(13, HIGH) umumnya berarti…',o:['Membaca pin 13','Mengatur output digital pin 13 ke keadaan HIGH','Menghapus pin 13','Menunggu 13 detik','Mengubah pin menjadi analog'],a:1,e:'digitalWrite() mengatur keluaran digital pada pin yang telah dikonfigurasi sebagai output.'},
{q:'delay(1000) memberi jeda selama…',o:['1 milidetik','10 detik','1000 detik','1 detik','100 menit'],a:3,e:'Satuan delay() adalah milidetik; 1000 ms sama dengan 1 detik.'},
{q:'Dalam sistem input–proses–output, tombol berperan sebagai…',o:['Output','Proses','Input','Catu daya utama','Program'],a:2,e:'Tombol memberi masukan yang dibaca oleh sistem.'},
{q:'LED eksternal umumnya perlu dipasang dengan…',o:['Resistor pembatas arus yang sesuai','Kabel USB dipotong sembarangan','Tegangan tanpa batas','Dua pin GND saja','Baterai tanpa memperhatikan polaritas'],a:0,e:'Resistor membatasi arus LED agar komponen tidak rusak.'},
{q:'Apa perbedaan umum Arduino Uno dengan single-board computer?',o:['Arduino Uno selalu menjalankan desktop OS','Arduino Uno berfokus pada kendali berbasis mikrokontroler; SBC umumnya menjalankan OS lengkap','Tidak ada perbedaan sama sekali','Arduino Uno tidak dapat menjalankan program','SBC tidak memiliki prosesor'],a:1,e:'Arduino Uno menjalankan program mikrokontroler, sedangkan SBC umumnya memiliki kemampuan komputer umum dan OS.'},
{q:'Program LED tidak berkedip meski LED menyala terus. Hal pertama yang logis diperiksa adalah…',o:['Menghapus browser','Memeriksa urutan HIGH/LOW dan delay dalam loop()','Mengganti nama file gambar','Mematikan monitor','Menghapus semua resistor dari rangkaian'],a:1,e:'Periksa logika program: harus ada pergantian HIGH dan LOW serta jeda yang sesuai.'}
];
function renderQuiz(){const root=document.getElementById('quizArea');root.innerHTML='';questions.forEach((q,i)=>{const d=document.createElement('div');d.className='question';d.innerHTML=`<b>${i+1}. ${q.q}</b>`+q.o.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"> ${'ABCDE'[j]}. ${o}</label>`).join('')+`<div id="qfb${i}"></div>`;root.appendChild(d)})}
function gradeQuiz(){let score=0,answered=0;questions.forEach((q,i)=>{const selected=document.querySelector(`input[name="q${i}"]:checked`),fb=document.getElementById('qfb'+i);if(selected){answered++;if(Number(selected.value)===q.a){score++;fb.className='feedback good';fb.textContent='Benar. '+q.e}else{fb.className='feedback bad';fb.textContent='Belum tepat. '+q.e}}else{fb.className='feedback bad';fb.textContent='Belum dijawab. '+q.e}});const pct=Math.round(score/questions.length*100);document.getElementById('quizResult').innerHTML=`<h3>Hasil kuis: ${score}/${questions.length} (${pct}%)</h3><p>Terjawab: ${answered} dari ${questions.length}. ${pct>=90?'Sangat Baik':pct>=80?'Baik':pct>=70?'Cukup':'Perlu Belajar Kembali'}</p>`;markDone('kuis')}
function resetQuiz(){renderQuiz();document.getElementById('quizResult').textContent='Kuis direset. Silakan coba lagi.'}
const evalQs=[
{q:'Pin apa yang digunakan LED bawaan pada Arduino Uno R3 standar?',o:['Pin 3','Pin 7','Pin 13','Pin A0','Pin GND'],a:2},
{q:'Jika delay(500) digunakan, berapa lama jedanya?',o:['0,5 detik','5 detik','50 detik','500 detik','500 menit'],a:0},
{q:'Bagian program yang berulang adalah…',o:['setup()','loop()','include','comment','pinMode() saja'],a:1},
{q:'Untuk membaca tombol digital, fungsi yang umum digunakan adalah…',o:['digitalWrite()','delay()','digitalRead()','analogWrite() saja','setup()'],a:2}
];
function renderEval(){const root=document.getElementById('evalArea');root.innerHTML='';evalQs.forEach((q,i)=>{const d=document.createElement('div');d.className='question';d.innerHTML=`<b>${i+1}. ${q.q}</b>`+q.o.map((o,j)=>`<label class="option"><input type="radio" name="e${i}" value="${j}"> ${'ABCDE'[j]}. ${o}</label>`).join('');root.appendChild(d)});const d=document.createElement('div');d.className='question';d.innerHTML='<b>5. Jelaskan rancangan sistem sederhana dengan input, proses, dan output!</b><textarea id="shortAnswer" placeholder="Jawaban singkat..."></textarea><p class="muted">Jawaban ini dinilai oleh guru dan tidak masuk ke skor otomatis.</p>';root.appendChild(d)}
function gradeEval(){let score=0;evalQs.forEach((q,i)=>{const s=document.querySelector(`input[name="e${i}"]:checked`);if(s&&Number(s.value)===q.a)score++});const pct=Math.round(score/evalQs.length*100);document.getElementById('evalResult').innerHTML=`<h3>Skor pilihan ganda: ${score}/${evalQs.length} (${pct}%)</h3><p>${pct>=90?'Sangat Baik':pct>=80?'Baik':pct>=70?'Cukup':'Perlu Belajar Kembali'}</p><p>Jawaban nomor 5 perlu dinilai guru berdasarkan ketepatan input, proses/logika, dan output.</p>`;markDone('evaluasi')}
function copyReflection(){const fields=['r1','r2','r3','r4','r5'];const textOut=fields.map((id,i)=>`${i+1}. ${document.getElementById(id).previousElementSibling.textContent}\n${document.getElementById(id).value}`).join('\n\n');if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(textOut).then(()=>document.getElementById('reflectionStatus').textContent='Refleksi disalin.').catch(()=>fallbackCopy(textOut))}else fallbackCopy(textOut);markDone('refleksi')}
function fallbackCopy(t){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');document.getElementById('reflectionStatus').textContent='Refleksi disalin.'}catch(e){document.getElementById('reflectionStatus').textContent='Salin teks secara manual dari kolom refleksi.'}ta.remove()}
renderQuiz();renderEval();updateLight();
// Ekspos fungsi yang dipanggil tombol HTML agar tetap dapat dijangkau browser.
Object.assign(window, {
  startLearning, markDone, notify, showFlow, toggleBoardLed,
  startBlink, stopBlink, resetBlink, restartBlinkIfRunning,
  buttonInput, updateLight, checkCode, resetCode, runCodeDemo,
  gradeQuiz, resetQuiz, gradeEval, copyReflection
});


// Diagnostik sederhana agar masalah JavaScript terlihat di halaman.
window.addEventListener('error', function (event) {
  let box = document.getElementById('runtimeError');
  if (!box) {
    box = document.createElement('div');
    box.id = 'runtimeError';
    box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#fff0ed;color:#8f2419;padding:12px;border:2px solid #d94b3d;border-radius:8px;font:14px/1.4 Arial,sans-serif';
    document.body.appendChild(box);
  }
  box.textContent = 'Kesalahan JavaScript: ' + (event.message || 'tidak diketahui') + ' (baris ' + event.lineno + ').';
});

// Semua tombol berbasis atribut onclick menggunakan fungsi global ini.
Object.assign(window, {
  startLearning, markDone, notify, showFlow, toggleBoardLed, startBlink, stopBlink,
  resetBlink, restartBlinkIfRunning, buttonInput, updateLight, checkCode, resetCode,
  runCodeDemo, gradeQuiz, resetQuiz, gradeEval, copyReflection
});

console.info('Media Arduino Uno berhasil dimuat.');

