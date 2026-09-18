
// ── PLAN DATA (replaces static HTML) ──

const WEEKS_TOPICS={};
function makeTI(id){
  const {course,name}=getTopic(id);
  if(!name)return'';
  const lum='';
  const errBlock=`<div id="caperr-${id}"></div><div id="cap-epreset-${id}" class="cap-epreset-wrap" style="display:none"></div><div id="tierradd-${id}" style="display:none;margin-top:.15rem;align-items:center;gap:.2rem"><input id="ei-${id}" style="font-size:.64rem;padding:.1rem .3rem;background:#0a0a0f;border:1px solid var(--border);color:var(--text);border-radius:3px;width:130px" placeholder="error personalizado..." onclick="event.stopPropagation()"><button onclick="event.stopPropagation();saveCapError('${id}',document.getElementById('ei-${id}').value);document.getElementById('ei-${id}').value='';" style="font-size:.64rem;padding:.1rem .25rem;border:1px solid var(--accent2);color:var(--accent2);background:transparent;cursor:pointer;border-radius:3px">+error</button></div>`;
  const exBlock=`<span class="ex-badge" onclick="event.stopPropagation()" title="Ejercicios (meta según dificultad)"><input type="range" class="ex-slider" min="0" max="${getExGoal(id)}" value="${getExCount(id)}" oninput="setEx('${id}',this.value)"><span class="ex-num" id="exn-${id}">${getExCount(id)}/${getExGoal(id)}</span><span class="ex-bar-wrap"><span class="ex-bar-fill" id="exbf-${id}"></span></span></span>`;

  // Ícono de dependencias
  const depInfo=getTopicDependencyInfo(id);
  let depIcon='';
  if(depInfo.blocked){
    const names=depInfo.weakPrereqs.map(p=>TOPICS[course]?.[p]||p).join(', ');
    depIcon=`<span class="dep-badge blocked" onclick="event.stopPropagation();showDepInfo('${id}')" title="🔒 Bloqueado — prereq necesario débil: ${names}">🔒</span>`;
  } else if(depInfo.warned){
    const names=depInfo.weakSoft.map(p=>TOPICS[course]?.[p]||p).join(', ');
    depIcon=`<span class="dep-badge warned" onclick="event.stopPropagation();showDepInfo('${id}')" title="⚠ Prereq recomendado débil: ${names}">⚠</span>`;
  } else if(depInfo.isBottleneck){
    depIcon=`<span class="dep-badge bottleneck" onclick="event.stopPropagation();showDepInfo('${id}')" title="🎯 Cuello de botella — ${depInfo.dependents.length} dependientes">🎯</span>`;
  }

    const safeName=name.replace(/'/g,"&#39;").replace(/"/g,"&quot;");
  return`<div class="ti" data-id="${id}" data-course="${course}" data-name="${safeName}"><div class="tck" onclick="ck(event,'${id}')" title="Teoría vista (leí el capítulo / vi videos)"></div><div class="tck2" onclick="ck2(event,'${id}')" title="Problemas resueltos (practiqué con ejercicios)"></div><span class="tn">${name}${lum}${depIcon}${exBlock}</span><button class="db-cycle" onclick="sd(event,'${id}')" title="Dificultad (fácil / medio / pesado)">◆</button><span class="tlast" id="tl-${id}"></span><button class="tfb" onclick="event.stopPropagation();toggleCapErr('${id}')" title="Registrar error">⚠</button><button class="tfb" onclick="event.stopPropagation();document.getElementById('notes-${id}').classList.toggle('on')" title="Notas">✎</button></div><div class="tnotes-wrap" id="notes-${id}"><input class="tnote-input" placeholder="nota del tema..." oninput="saveNote('${id}',this.value)" onclick="event.stopPropagation()"></div>${errBlock}`;
}

function renderPlanTopics(){
  for(const[wid,ids]of Object.entries(WEEKS_TOPICS)){
    const el=document.getElementById('tp-'+wid);
    if(el){
     const groups=Object.keys(TOPICS)
  .map(course=>({
    course,
    ids:ids.filter(id=>getTopic(id).course===course)
  }))
  .filter(group=>group.ids.length);
            const SCIENCE=['Aritmética','Álgebra','Física','Geometría','Trigonometría','Química'];
      el.innerHTML=groups.map(group=>{
        const grp=SCIENCE.includes(group.course)?'ciencias':'letras';
        return '<div class="week-course-group" data-course="'+group.course+'" data-group="'+grp+'"><div class="week-course-label">'+courseLabel(group.course)+'</div>'+group.ids.map(makeTI).join('')+'</div>';
            }).join('');
    }
  }
}

  const KEY='uni-luis-v12';
/* ═══ GRAFO DE DEPENDENCIAS ═══ */
// Cada clave = tema que DEPENDE de los temas del array.
// Solo los links críticos. Si un prereq está débil (<40% dominio), el tema queda bloqueado.

const DEPENDENCIES = {
  // ── ÁLGEBRA ──
  'al3':['al2'],           // Productos notables depende de Exponentes
  'al4':['al2','al3'],     // Polinomios depende de Exponentes y Productos notables
  'al5':['al3','al4'],     // Divisiones depende de Productos y Polinomios
  'al7':['al3','al5'],     // Factorización depende de Productos y Divisiones
  'al8':['al2','al4'],     // Complejos I depende de Exponentes y Polinomios
  'al10':['al7'],          // Ec. polinomiales depende de Factorización
  'al11':['al7','al10'],   // Ec. grado superior depende de Factorización y Ec. polinomiales
  'al13':['al12'],         // Inecuaciones depende de Desigualdades
  'al16':['al2'],          // Logaritmos depende de Exponentes
  'al17':['al16'],         // Funciones depende de Logaritmos (dominio, rango)
  'al20':['al17'],         // Función inversa depende de Funciones

  // ── ARITMÉTICA ──
  'a5':['a1','a2'],        // Regla de mezcla depende de Razones y Magnitudes
  'a6':['a4'],             // Interés depende de Tanto por cuanto
  'a7':['a4'],             // Descuento depende de Tanto por cuanto
  'a13':['a10','a12'],     // Divisibilidad depende de Numeración y Operaciones
  'a14':['a13'],           // Clasificación Z+ depende de Divisibilidad
  'a15':['a13','a14'],     // MCD/MCM depende de Divisibilidad y Clasificación
  'a16':['a13'],           // Potenciación depende de Divisibilidad
  'a19':['a18'],           // Análisis combinatorio depende de Estadística

// ── FÍSICA ──
  'f3':['f2'],           // Cinemática necesita vectores
  'f4':['f2'],           // Estática necesita vectores
  'f5':['f2','f3'],      // Dinámica necesita vectores + cinemática
  'f6':['f5'],           // Trabajo y potencia necesita dinámica
  'f7':['f5','f6'],      // Energía necesita dinámica + trabajo
  'f8':['f5'],           // Cantidad de movimiento necesita dinámica
  'f9':['f8'],           // Choques necesita cantidad de movimiento
  'f11':['f5'],          // MAS necesita dinámica
  'f12':['f5'],          // Gravitación necesita dinámica
  'f14':['f13'],         // Termodinámica necesita calor
  'f16':['f15'],         // Electrodinámica necesita electrostática
  'f17':['f16'],         // Magnetismo necesita electrodinámica
  'f18':['f16','f17'],   // Electromagnetismo necesita electrodinámica + magnetismo
  'f19':['f18'],         // Óptica necesita electromagnetismo


  // ── GEOMETRÍA ──
  'g2':['g1'],             // Triángulos depende de Líneas y ángulos
  'g3':['g2'],             // Polígonos depende de Triángulos
  'g4':['g2','g3'],        // Cuadriláteros depende de Triángulos y Polígonos
  'g5':['g1','g2'],        // Circunferencia depende de Líneas y Triángulos
  'g6':['g5'],             // Polígonos inscritos depende de Circunferencia
  'g7':['g2','g5'],        // Puntos notables depende de Triángulos y Circunferencia
  'g8':['g2'],             // Proporcionalidad depende de Triángulos
  'g9':['g5','g8'],        // Relaciones métricas depende de Circunferencia y Proporcionalidad
  'g11':['g2','g4'],       // Áreas planas depende de Triángulos y Cuadriláteros
  'g13':['g11'],           // Poliedros depende de Áreas
  'g14':['g13'],           // Prismas/cilindros depende de Poliedros
  'g15':['g13'],           // Pirámide/cono depende de Poliedros
  'g16':['g13','g15'],     // Esfera depende de Poliedros y Pirámide
  'g17':['g9'],            // Geometría analítica depende de Relaciones métricas

  // ── TRIGONOMETRÍA ──
  't2':['t1'],             // Razones trig depende de Medición angular
  't3':['t1','t2'],        // Ángulo posición normal depende de anteriores
  't4':['t3'],             // Identidades I depende de Ángulo posición
  't5':['t4'],             // Identidades II depende de Identidades I
  't6':['t2','t4'],        // Resolución triángulos depende de Razones e Identidades
  't7':['t3'],             // Circunferencia trig depende de Ángulo posición
  't8':['t7'],             // Funciones directas depende de Circunferencia trig
  't9':['t8'],             // Funciones inversas depende de Funciones directas
  't10':['t5','t8'],       // Ecuaciones trig depende de Identidades y Funciones
  't11':['t9'],            // Secciones cónicas depende de Funciones inversas
  't13':['t3','t5'],       // Complejos trig depende de Ángulo e Identidades

  // ── QUÍMICA ──
  'q3':['q2'],           // Números cuánticos necesita teoría atómica
  'q4':['q2','q3'],      // Tabla periódica necesita atómica + cuánticos
  'q5':['q4'],           // Enlace necesita tabla periódica
  'q8':['q6'],           // Unidades de masa necesita nomenclatura
  'q9':['q8'],           // Composición estequiométrica necesita unidades de masa
  'q10':['q7'],          // Estado gaseoso necesita conceptos físicos
  'q11':['q7'],          // Líquidos y sólidos necesita conceptos físicos
  'q12':['q6','q8'],     // Reacciones necesita nomenclatura + unidades
  'q13':['q12'],         // Estequiometría necesita reacciones
  'q14':['q13'],         // Soluciones necesita estequiometría
  'q15':['q12','q13'],   // Cinética/equilibrio necesita reacciones + estequiometría
  'q16':['q15'],         // Ácidos/bases necesita equilibrio
  'q17':['q16'],         // Electroquímica necesita ácidos/bases
  'q18':['q5','q6'],     // Orgánica necesita enlace + nomenclatura

    // ── RM (críticos) ──
  'rm4':['rm1'],           // Lógica proposicional depende de Razonamiento Lógico
  'rm5':['rm4'],           // Lógica de clases depende de Proposicional
  'rm8':['rm7'],           // Deductivo depende de Inductivo
  'rm11':['rm7'],          // Planteo ecuaciones depende de Inductivo
  'rm23':['rm22'],         // Suficiencia II depende de Suficiencia I
};

// Prereqs blandos: solo advierten, NO bloquean. El tema se puede estudiar
// sin dominar al 100% el prereq, pero probablemente te cueste más.
const SOFT_DEPS = {
  // ── Álgebra ──
  'al7':['al4'],           // Factorización sin polinomios perfectos: se puede
  'al11':['al4'],          // Ec. grado superior sin polinomios: se puede
  
  // ── Física ──
  'f4':['f3'],           // Estática se puede estudiar sin cinemática perfecta
  'f8':['f6'],           // Cantidad de movimiento sin trabajo al 100%
  'f9':['f7'],           // Choques sin energía al 100%
  'f16':['f5'],          // Electrodinámica sin dinámica dominada
  
  // ── Geometría ──
  'g7':['g1'],             // Puntos notables sin ángulos perfectos
  'g11':['g8'],            // Áreas sin proporcionalidad perfecta
  'g17':['g2'],            // Geo analítica sin triángulos al 100%
  
  // ── Trigonometría ──
  't6':['t5'],             // Resolución sin identidades II al 100%
  't10':['t6'],            // Ecuaciones trig sin resolución de triángulos
  
  // ── Química ──
  'q9':['q6'],           // Composición sin nomenclatura perfecta
  'q13':['q11'],         // Estequiometría sin líquidos/sólidos perfectos
  'q16':['q13'],         // Ácidos/bases sin estequiometría al 100%
};

// Función: devuelve prereqs de un tema
function getPrereqs(topicId){
  return DEPENDENCIES[topicId]||[];
}

// Función: devuelve dependientes de un tema (reverse lookup)
function getDependents(topicId){
  const deps=[];
  for(const [id,prereqs] of Object.entries(DEPENDENCIES)){
    if(prereqs.includes(topicId))deps.push(id);
  }
  return deps;
}

// Función: dominio estimado de un tema (0-100)
function getTopicMastery(topicId){
  const t=(S.t||{})[topicId]||{};

  // Fuente de verdad: rendimiento REAL medido (cronómetro + flashcards)
  if(typeof t.nivelDominio==='number' && t.nivelDominio>0){
    return Math.min(100,Math.round(t.nivelDominio));
  }

  // Fallback: sin rendimiento registrado aún.
  // Marcar "done" solo significa "leí/hice algo" → techo del 50%.
  let score=t.done?50:0;
  const speed=(S.speedSessions||[]).filter(s=>s.topicId===topicId);
  if(speed.length){
    const totalProbs=speed.reduce((a,s)=>a+(s.easy+s.hard+s.skipped+s.failed),0);
    const aciertos=speed.reduce((a,s)=>a+(s.easy+s.hard),0);
    if(totalProbs>0){
      score=Math.round(aciertos/totalProbs*100);
    }
  }
  return Math.min(100,score);
}
// Devuelve {blocked:bool, weakPrereqs:[ids], dependents:[ids], isBottleneck:bool}
function getTopicDependencyInfo(topicId){
  const mastery=getTopicMastery(topicId);
  const prereqs=getPrereqs(topicId);
  const soft=SOFT_DEPS[topicId]||[];
  const weakPrereqs=prereqs.filter(p=>getTopicMastery(p)<40);
  const weakSoft=soft.filter(p=>getTopicMastery(p)<40);
  const dependents=getDependents(topicId);
  const weakDependents=dependents.filter(d=>getTopicMastery(d)<40);
  const blocked=weakPrereqs.length>0&&mastery<70;
  const warned=!blocked&&weakSoft.length>0&&mastery<70;
  const isBottleneck=dependents.length>=2&&mastery<60;
  return{blocked,warned,weakPrereqs,weakSoft,dependents,weakDependents,isBottleneck,mastery};
}
/* Modal/detalle de dependencias de un tema */
function showDepInfo(topicId){
  const info=getTopicDependencyInfo(topicId);
  const topicName=getTopic(topicId).name||topicId;
  const course=Object.keys(TOPICS).find(c=>TOPICS[c]?.[topicId]);
  let msg='📌 '+topicName+'\n\n';

  if(info.prereqs&&info.prereqs.length){
    msg+='PREREQUISITOS NECESARIOS:\n';
    info.prereqs.forEach(p=>{
      const name=TOPICS[course]?.[p]||p;
      const m=getTopicMastery(p);
      const icon=m<40?'🔴':m<70?'🟡':'🟢';
      msg+=icon+' '+name+' (dominio: '+m+'%)\n';
    });
    msg+='\n';
  }

  if(info.weakSoft&&info.weakSoft.length){
    msg+='PREREQUISITOS RECOMENDADOS (débiles):\n';
    info.weakSoft.forEach(p=>{
      const name=TOPICS[course]?.[p]||p;
      const m=getTopicMastery(p);
      const icon=m<40?'🔴':m<70?'🟡':'🟢';
      msg+=icon+' '+name+' (dominio: '+m+'%)\n';
    });
    msg+='\n';
  }

  const deps=getDependents(topicId);
  if(deps.length){
    msg+='DESBLOQUEA:\n';
    deps.forEach(d=>{
      const name=TOPICS[course]?.[d]||d;
      const m=getTopicMastery(d);
      const icon=m<40?'🔴':m<70?'🟡':'🟢';
      msg+=icon+' '+name+' (dominio: '+m+'%)\n';
    });
    msg+='\n';
  }

  msg+='Tu dominio: '+info.mastery+'%\n';
  if(info.blocked)msg+='\n🔒 BLOQUEADO por prereq débil.';
  if(info.isBottleneck)msg+='\n🎯 CUELLO DE BOTELLA — estudiarlo rinde mucho.';

  const accent=info.blocked?'var(--accent2)':info.isBottleneck?'var(--accent4)':'var(--accent3)';
  const icon=info.blocked?'🔒':info.isBottleneck?'🎯':'📌';
  showModal(topicName,msg.replace(/\n/g,'<br>'),{accent,icon});
}
  // ═══ EMOJIS GLOBALES DE CURSOS ═══
const COURSE_EMOJIS={
  'Aritmética':'🔢','Álgebra':'🧮','Física':'⚛️','Geometría':'📐',
  'Trigonometría':'📏','Química':'🧪','Raz. Matemático':'🧠',
  'Raz. Verbal':'📖','Historia Universal':'🌍','Historia del Perú':'🏔️',
  'Geografía':'🗺️','Filosofía':'💭','Literatura':'📚','Lenguaje':'✍️','Inglés':'💂',
  // Aliases por si hay datos viejos
  'RV':'📖','RM':'🧠','Historia':'🌍','Ingles':'💂',
  'Economía':'💰','Economia':'💰','Actualidad':'📰','Simulacros':'📝',
  'Psicología':'👤'
};

function courseEmoji(name){
  return COURSE_EMOJIS[name]||'';
}

function courseLabel(name){
  const em=courseEmoji(name);
  return (em?em+' ':'')+(name||'');
}
  // Mapas para sincronización calendario ↔ plan
const SCHEDULE_COURSE_ROWS={
  'Física':[1,3,5],'Geometría':[1,3,5],'Química':[1,3,5],
  'Trigonometría':[7,9,11],'Álgebra':[7,9,11],'Aritmética':[7,9,11]
};
const SESION_FIELD={
  'Física':{0:'done',3:'done2'},'Geometría':{1:'done',4:'done2'},'Química':{2:'done',5:'done2'},
  'Trigonometría':{0:'done',3:'done2'},'Álgebra':{1:'done',4:'done2'},'Aritmética':{2:'done',5:'done2'}
};
const PRUEBA_AM={0:'Física',1:'Geometría',2:'Química',3:'Física',4:'Geometría',5:'Química'};
const PRUEBA_PM={0:'Trigonometría',1:'Álgebra',2:'Aritmética',3:'Trigonometría',4:'Álgebra',5:'Aritmética'};
function getCourseForCell(label,row,dow){
  if(!label)return null;
  const s=label.toLowerCase();
  if(label===REST||label==='Dormir'||s.includes('descanso'))return null;
  if(s.includes('física'))return 'Física';
  if(s.includes('geometr'))return 'Geometría';
  if(s.includes('química'))return 'Química';
  if(s.includes('trigo'))return 'Trigonometría';
  if(s.includes('álgebra'))return 'Álgebra';
  if(s.includes('aritmética'))return 'Aritmética';
  if(label==='Prueba y errores')return (row===5?PRUEBA_AM:dow?PRUEBA_PM:PRUEBA_PM)[dow]||null;
  if(row===13){
    if(label==='RM')return 'Raz. Matemático';
    if(label==='RV')return 'Raz. Verbal';
    return null;
  }
  if(row===15){
    const m={
      'Lenguaje':'Lenguaje',
      'Inglés':'Inglés',
      'Economía':'Economía',
      'Geografía':'Geografía',
      'Historia del Perú':'Historia del Perú',
      'Historia Universal':'Historia Universal',
      'Literatura':'Literatura',
      'Filosofía':'Filosofía',
      'Psicología':'Psicología'
    };
    return m[label]||null;
  }
  return null;
}
function dowFromDs(ds){return (new Date(ds+'T12:00:00').getDay()+6)%7;}

// ── CURSOS ──
const COURSES = {
  aritmetica: {
    id: 'aritmetica',
    name: 'Aritmética',
    group: 'ciencias'
  },
  algebra: {
    id: 'algebra',
    name: 'Álgebra',
    group: 'ciencias'
  },
  fisica: {
    id: 'fisica',
    name: 'Física',
    group: 'ciencias'
  },
  geometria: {
    id: 'geometria',
    name: 'Geometría',
    group: 'ciencias'
  },
  trigonometria: {
    id: 'trigonometria',
    name: 'Trigonometría',
    group: 'ciencias'
  },
  quimica: {
    id: 'quimica',
    name: 'Química',
    group: 'ciencias'
  },

  historia: {
    id: 'historia',
    name: 'Historia',
    group: 'letras'
  },
  geografia: {
    id: 'geografia',
    name: 'Geografía',
    group: 'letras'
  },
  filosofia: {
    id: 'filosofia',
    name: 'Filosofía',
    group: 'letras'
  },
  literatura: {
    id: 'literatura',
    name: 'Literatura',
    group: 'letras'
  },
  lenguaje: {
    id: 'lenguaje',
    name: 'Lenguaje',
    group: 'letras'
  },
  razonVerbal: {
    id: 'razonVerbal',
    name: 'Raz. Verbal',
    group: 'letras'
  },
  ingles: {
    id: 'ingles',
    name: 'Inglés',
    group: 'letras'
  }
};
const TOPICS = {

  Aritmética: {
    a1:"Cap. I · Razones y proporciones",
    a2:"Cap. II · Magnitudes proporcionales",
    a3:"Cap. III · Promedios",
    a4:"Cap. IV · El tanto por cuanto",
    a5:"Cap. V · Regla de mezcla",
    a6:"Cap. VI · Regla de interés",
    a7:"Cap. VII · Regla de descuento",
    a8:"Cap. VIII · Lógica proposicional",
    a9:"Cap. IX · Teoría de conjuntos",
    a10:"Cap. X · Numeración",
    a11:"Cap. XI · Sucesiones",
    a12:"Cap. XII · Operaciones fundamentales",
    a13:"Cap. XIII · Divisibilidad",
    a14:"Cap. XIV · Clasificación de los Z+",
    a15:"Cap. XV · MCD y MCM",
    a16:"Cap. XVI · Potenciación y radicación",
    a17:"Cap. XVII · Números racionales",
    a18:"Cap. XVIII · Estadística descriptiva",
    a19:"Cap. XIX · Análisis combinatorio",
    a20:"Cap. XX · Probabilidades"
  },

  Álgebra: {
    al1:"Cap. I · Introducción al álgebra",
    al2:"Cap. II · Exponentes y radicales",
    al3:"Cap. III · Productos notables",
    al4:"Cap. IV · Polinomios",
    al5:"Cap. V · Divisiones algebraicas",
    al6:"Cap. VI · Divisibilidad de polinomios",
    al7:"Cap. VII · Factorización",
    al8:"Cap. VIII · Números complejos I",
    al9:"Cap. IX · Números complejos II",
    al10:"Cap. X · Ecuaciones polinomiales",
    al11:"Cap. XI · Ecuaciones grado superior",
    al12:"Cap. XII · Desigualdades",
    al13:"Cap. XIII · Inecuaciones",
    al14:"Cap. XIV · Expresiones fraccionarias",
    al15:"Cap. XV · Valor absoluto",
    al16:"Cap. XVI · Logaritmos",
    al17:"Cap. XVII · Funciones",
    al18:"Cap. XVIII · Álgebra de funciones",
    al19:"Cap. XIX · Funciones especiales",
    al20:"Cap. XX · Función inversa",
    al21:"Cap. XXI · Límite de función",
    al22:"Cap. XXII · Sucesiones",
    al23:"Cap. XXIII · Series",
    al24:"Cap. XXIV · Matrices",
    al25:"Cap. XXV · Determinantes",
    al26:"Cap. XXVI · Matriz inversa",
    al27:"Cap. XXVII · Sistema de ecuaciones",
    al28:"Cap. XXVIII · Prog. lineal"
  },

  Física: {
    f1:"Cap. I · Análisis dimensional",
    f2:"Cap. II · Análisis vectorial",
    f3:"Cap. III · Cinemática",
    f4:"Cap. IV · Estática",
    f5:"Cap. V · Dinámica",
    f6:"Cap. VI · Trabajo y potencia",
    f7:"Cap. VII · Energía",
    f8:"Cap. VIII · Cantidad de movimiento",
    f9:"Cap. IX · Choques",
    f10:"Cap. X · Estática de fluidos",
    f11:"Cap. XI · Movimiento armónico simple (MAS)",
    f12:"Cap. XII · Gravitación universal",
    f13:"Cap. XIII · Calor",
    f14:"Cap. XIV · Termodinámica",
    f15:"Cap. XV · Electrostática",
    f16:"Cap. XVI · Electrodinámica",
    f17:"Cap. XVII · Magnetismo",
    f18:"Cap. XVIII · Electromagnetismo",
    f19:"Cap. XIX · Óptica",
    f20:"Cap. XX · Física moderna"
  },

  Geometría: {
    g1:"Cap. I · Líneas y ángulos",
    g2:"Cap. II · Triángulos",
    g3:"Cap. III · Polígonos",
    g4:"Cap. IV · Cuadriláteros",
    g5:"Cap. V · Circunferencia",
    g6:"Cap. VI · Polígonos inscritos",
    g7:"Cap. VII · Puntos notables",
    g8:"Cap. VIII · Proporcionalidad",
    g9:"Cap. IX · Relaciones métricas",
    g10:"Cap. X · Polígonos regulares",
    g11:"Cap. XI · Áreas planas",
    g12:"Cap. XII · Rectas y planos",
    g13:"Cap. XIII · Poliedros",
    g14:"Cap. XIV · Prismas y cilindros",
    g15:"Cap. XV · Pirámide y cono",
    g16:"Cap. XVI · Esfera + Pappus",
    g17:"Cap. XVII · Geometría analítica",
    g18:"Cap. XVIII · Circunferencia y parábola"
  },

  Trigonometría: {
    t1:"Cap. I · Medición angular",
    t2:"Cap. II · Razones trig agudo",
    t3:"Cap. III · Ángulo posición normal",
    t4:"Cap. IV · Identidades trig I",
    t5:"Cap. V · Identidades trig II",
    t6:"Cap. VI · Resolución triángulos",
    t7:"Cap. VII · Circunferencia trig",
    t8:"Cap. VIII · Funciones directas",
    t9:"Cap. IX · Funciones inversas",
    t10:"Cap. X · Ecuaciones trig",
    t11:"Cap. XI · Secciones cónicas",
    t12:"Cap. XII · Transformación coordenadas",
    t13:"Cap. XIII · Complejos en trig"
  },

    Química: {
    q1:"Cap. I · Materia y energía",
    q2:"Cap. II · Teoría atómica y estructura moderna",
    q3:"Cap. III · Números cuánticos y configuración",
    q4:"Cap. IV · Tabla periódica",
    q5:"Cap. V · Enlace químico",
    q6:"Cap. VI · Nomenclatura inorgánica",
    q7:"Cap. VII · Conceptos físicos",
    q8:"Cap. VIII · Unidades químicas de masa",
    q9:"Cap. IX · Composición estequiométrica",
    q10:"Cap. X · Estado gaseoso",
    q11:"Cap. XI · Líquidos y sólidos",
    q12:"Cap. XII · Reacciones químicas",
    q13:"Cap. XIII · Estequiometría",
    q14:"Cap. XIV · Soluciones",
    q15:"Cap. XV · Cinética y equilibrio químico",
    q16:"Cap. XVI · Ácidos y bases",
    q17:"Cap. XVII · Electroquímica",
    q18:"Cap. XVIII · Química orgánica",
    q19:"Cap. XIX · Ecología, química descriptiva y aplicada"
  },

  Literatura: {
    l1:"Teoría literaria y figuras literarias",
    l2:"Literatura griega: épica y Homero",
    l3:"Literatura griega: tragedia",
    l4:"Literatura medieval, Renacimiento y Barroco",
    l5:"Romanticismo y Realismo",
    l6:"Narrativa contemporánea",
    l7:"Literatura medieval española y Siglo de Oro",
    l8:"Teatro del Siglo de Oro",
    l9:"Cervantes y generaciones españolas",
    l10:"Modernismo y narrativa latinoamericana",
    l11:"Boom latinoamericano",
    l12:"Poesía latinoamericana contemporánea",
    l13:"Literatura peruana: prehispánica y colonial",
    l14:"Emancipación y Costumbrismo",
    l15:"Romanticismo y Realismo peruano",
    l16:"Modernismo, Posmodernismo y Colónida",
    l17:"Vanguardismo peruano",
    l18:"Indigenismo peruano",
    l19:"Generaciones del 50, 60 y 70",
    l20:"Repaso general"
  },

  "Raz. Verbal": {
    rv1:"Definiciones",
    rv2:"Analogías",
    rv3:"Precisión léxica",
    rv4:"Antonimia contextual",
    rv5:"Conectores lógico-textuales",
    rv6:"Información eliminada",
    rv7:"Plan de redacción",
    rv8:"Inclusión de enunciado",
    rv9:"Coherencia y cohesión",
    rv10:"Comprensión lectora",
    rv11:"Macroestructura textual",
    rv12:"Textos continuos",
    rv13:"Textos discontinuos",
    rv14:"Mapas conceptuales",
    rv15:"El resumen",
    rv16:"Sentido contextual",
    rv17:"Inferencias",
    rv18:"Compatibilidad e incompatibilidad",
    rv19:"Extrapolación",
    rv20:"Textos filosóficos y científicos"
  },

  Lenguaje: {
    le1:"Comunicación y lenguaje",
    le2:"Mayúsculas y minúsculas",
    le3:"Sílaba y acentuación",
    le4:"Acentuación especial",
    le5:"Grafías y prefijos",
    le6:"Sustantivo",
    le7:"Determinantes",
    le8:"Significado y relaciones semánticas",
    le9:"Repaso I",
    le10:"Frase nominal y concordancia",
    le11:"Verbo y conjugación",
    le12:"Verboides y perífrasis",
    le13:"Preposición, adverbio y conjunción",
    le14:"Oración simple I",
    le15:"Oración simple II",
    le16:"Signos de puntuación",
    le17:"Vicios del lenguaje y oración compuesta",
    le18:"Repaso II",
    le19:"Oración subordinada sustantiva",
    le20:"Oración subordinada adjetiva y adverbial"
  },

  "Historia Universal": {
    h1:"Prehistoria",
    h2:"Edad Antigua: Mesopotamia y Egipto",
    h3:"Grecia y Roma",
    h4:"Edad Media",
    h5:"Edad Moderna",
    h6:"Revoluciones burguesas",
    h7:"Revolución Industrial e I Guerra Mundial",
    h8:"Entre guerras y II Guerra Mundial",
    h9:"Guerra Fría",
    h10:"Globalización y nuevo orden mundial",

  },

  "Historia del Perú": {
    hp1:"Poblamiento americano y peruano",
    hp2:"Altas culturas andinas I",
    hp3:"Altas culturas andinas II",
    hp4:"Tahuantinsuyo e invasión española",
    hp5:"Perú colonial",
    hp6:"Independencia del Perú",
    hp7:"República peruana del siglo XIX",
    hp8:"Perú: posguerra y Oncenio",
    hp9:"Perú: 1930-1980",
    hp10:"Perú: 1980-actualidad",

  },

  Geografía: {
    ge1:"Teoría geográfica y coordenadas",
    ge2:"Cartografía",
    ge3:"Perú: contexto geopolítico",
    ge4:"Integración y relaciones internacionales",
    ge5:"Geografía humana y población",
    ge6:"Estado peruano",
    ge7:"Democracia y participación ciudadana",
    ge8:"Organizaciones civiles y Estado de Derecho",
    ge9:"Convivencia y diversidad cultural",
    ge10:"Ecosistemas y problemas ambientales",
    ge11:"Áreas protegidas",
    ge12:"Geomorfología del Perú",
    ge13:"Mar peruano",
    ge14:"Hidrografía del Perú",
    ge15:"Regiones naturales",
    ge16:"Ecorregiones",
    ge17:"Actividades económicas I",
    ge18:"Actividades económicas II",
    ge19:"Repaso I",
    ge20:"Repaso II"
  },

  Inglés: {
    i1:"Greetings y verbo to be",
    i2:"Simple present",
    i3:"Can/can't y posesivos",
    i4:"Present y past continuous",
    i5:"Simple past: to be",
    i6:"Simple past: direcciones",
    i7:"Simple past: irregulares",
    i8:"Going to y would like",
    i9:"Will y presente continuo futuro",
    i10:"Infinitivos, gerundios y adverbios",
    i11:"Comparativos y superlativos",
    i12:"Present perfect",
    i13:"Present perfect vs. simple past",
    i14:"Modal verbs",
    i15:"Past perfect",
    i16:"Zero y first conditional",
    i17:"Second y third conditional",
    i18:"Mixed conditionals",
    i19:"Repaso I",
    i20:"Repaso II"
  },

  "Raz. Matemático": {
    rm1:"Razonamiento Lógico",
    rm2:"Ordenamiento de Información",
    rm3:"Distribuciones Numéricas",
    rm4:"Lógica Proposicional",
    rm5:"Lógica de Clases",
    rm6:"Verdades y Mentiras",
    rm7:"Razonamiento Inductivo",
    rm8:"Razonamiento Deductivo",
    rm9:"Parentescos y Certezas",
    rm10:"Calendarios",
    rm11:"Planteo de Ecuaciones e Inecuaciones",
    rm12:"Problemas sobre Edades y Conjuntos",
    rm13:"Ecuaciones Diofánticas",
    rm14:"Conteo de Figuras",
    rm15:"Máximos y Mínimos",
    rm16:"Operaciones Matemáticas I",
    rm17:"Operaciones Matemáticas II",
    rm18:"Operaciones Matemáticas III",
    rm19:"Psicotécnico",
    rm20:"Razonamiento Abstracto",
    rm21:"Análisis e Interpretación de Gráficos Estadísticos",
    rm22:"Suficiencia de Datos I",
    rm23:"Suficiencia de Datos II"
  },

  Filosofía: {
    fi1:"Introducción a la Filosofía",
    fi2:"Presocráticos",
    fi3:"Sócrates y Platón",
    fi4:"Aristóteles y Helenismo",
    fi5:"Racionalismo y Empirismo",
    fi6:"Ilustración",
    fi7:"Kant y Hegel",
    fi8:"Comte y Marx",
    fi9:"Nietzsche y Existencialismo",
    fi10:"Filosofía analítica",
    fi11:"Axiología",
    fi12:"Ética",
    fi13:"Filosofía política",
    fi14:"Gnoseología",
    fi15:"Epistemología",
    fi16:"Lógica I",
    fi17:"Lógica II",
    fi18:"Lógica III",
    fi19:"Repaso I",
    fi20:"Repaso II"
  },

  Economía: {
    ec1:"Definición y conceptos básicos",
    ec2:"Doctrinas económicas I: mercantilista, fisiócrata y clásica",
    ec3:"Doctrinas económicas II: socialista, neoclásica, keynesiana y monetarista",
    ec4:"Necesidades humanas. Bienes y servicios",
    ec5:"Factores productivos y proceso económico",
    ec6:"Teoría del mercado I: demanda y oferta",
    ec7:"Teoría del mercado II: equilibrio y desequilibrio",
    ec8:"Teoría de la empresa",
    ec9:"Modelos de mercado",
    ec10:"Sistema monetario",
    ec11:"Sistema financiero",
    ec12:"Sector público",
    ec13:"Sector público y política económica",
    ec14:"Agregados e indicadores económicos",
    ec15:"Crecimiento y desarrollo económico",
    ec16:"Comercio internacional",
    ec17:"Sistema monetario internacional: balanza de pagos",
    ec18:"Organismos financieros internacionales e integración",
    ec19:"Repaso I",
    ec20:"Repaso II"
  },

  Psicología: {
    ps1:"La Psicología: definición, objetivos y métodos",
    ps2:"Origen e historia de la Psicología",
    ps3:"El proceso de socialización del hombre",
    ps4:"Factores biológicos del comportamiento I: SNC",
    ps5:"Factores biológicos del comportamiento II: SNP y endocrino",
    ps6:"Procesos cognitivos: sensación",
    ps7:"La conciencia y la atención",
    ps8:"La percepción",
    ps9:"Memoria",
    ps10:"Pensamiento y lenguaje",
    ps11:"Imaginación y creatividad",
    ps12:"Procesos afectivos y conativos",
    ps13:"La inteligencia",
    ps14:"Aprendizaje",
    ps15:"El sistema de la personalidad",
    ps16:"Psicoanálisis",
    ps17:"Sexualidad",
    ps18:"Salud psicológica",
    ps19:"Repaso I",
    ps20:"Repaso II"
  }

};

// ── ÍNDICE DE TEMAS (agregar esto) ──
const TOPIC_INDEX = {};
for (const [course, topics] of Object.entries(TOPICS)) {
  for (const [id, name] of Object.entries(topics)) {
    TOPIC_INDEX[id] = { id, course, name };
  }
}
// Registro de las sesiones sintéticas "__part" generadas por buildWeeklyStudyPlan.
// No contamina TOPICS (que queda como fuente pura).
const PLAN_PARTS = {};  // { 'al3__part1': { course:'Álgebra', name:'...' } }
const DATA_VERSION=12;
const OP_WEEKS=['w4','w5','w6','w16','w24'];
const SURGERY_NOTE='Cirugía catarata PPV: bloque 18–31 jul (confirmado) · ambos ojos · 6-7 d entre ojos';
const WEEK_HOURS={w1:5,w2:6,w3:6,w4:7,w5:7,w7:7,w8:8,w9:8,w10:1.5,w11:8,w12:8,w13:8,w15:6};
function getWeekTargetHours(wid){return WEEK_HOURS[wid]??8;}
let S={};
let weekPendingFilter=false;
let lastFocusedTopicId=null;
const WSCHED=[{id:"w1",s:"2026-05-24",e:"2026-05-31",topics:WEEKS_TOPICS.w1},{id:"w2",s:"2026-06-01",e:"2026-06-07",topics:WEEKS_TOPICS.w2},{id:"w3",s:"2026-06-08",e:"2026-06-14",topics:WEEKS_TOPICS.w3},{id:"w4",s:"2026-06-15",e:"2026-06-21",topics:WEEKS_TOPICS.w4},{id:"w5",s:"2026-06-22",e:"2026-06-25",topics:WEEKS_TOPICS.w5},{id:"w7",s:"2026-06-26",e:"2026-06-30",topics:WEEKS_TOPICS.w7},{id:"w8",s:"2026-07-01",e:"2026-07-05",topics:WEEKS_TOPICS.w8},{id:"w9",s:"2026-07-06",e:"2026-07-10",topics:WEEKS_TOPICS.w9},{id:"w11",s:"2026-07-11",e:"2026-07-17",topics:WEEKS_TOPICS.w11},{id:"w10",s:"2026-07-18",e:"2026-07-31",topics:WEEKS_TOPICS.w10},{id:"w12",s:"2026-08-01",e:"2026-08-04",topics:WEEKS_TOPICS.w12},{id:"w13",s:"2026-08-05",e:"2026-08-08",topics:WEEKS_TOPICS.w13},{id:"w15",s:"2026-08-09",e:"2026-08-09",topics:WEEKS_TOPICS.w15}];

// Target de segundos por problema según curso (aproximado UNI)
const SPEED_TARGETS_DEFAULT={
  'Aritmética':90,'Álgebra':135,'Física':165,'Geometría':150,
  'Trigonometría':135,'Química':105,'Raz. Matemático':105,
  'Raz. Verbal':90,'Historia Universal':75,'Historia del Perú':75,
  'Geografía':75,'Filosofía':75,'Literatura':75,'Lenguaje':75,'Inglés':75
};
function getSpeedTarget(course){
  return (S.speedTargets&&S.speedTargets[course])||SPEED_TARGETS_DEFAULT[course]||120;
}
// ── PLAN SEMANAL: cada ciencia aparece todas las semanas ──
const PLAN_START='2026-08-10';
const PLAN_END='2027-02-15';
const PLAN_TOTAL_WEEKS=27;
const PLAN_STUDY_WEEK_NUMBERS=[1,2,3,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23];
const PLAN_STUDY_WEEK_COUNT=PLAN_STUDY_WEEK_NUMBERS.length;
const PLAN_COURSES = Object.values(COURSES).filter(c => c.group === 'ciencias').map(c => c.name); const COURSE_BY_NAME = Object.fromEntries(Object.values(COURSES).map(c => [c.name, c]));
const PLAN_SPECIAL_WEEKS={
  4:{badge:'🏥 CIRUGÍA 1',desc:'Cirugía catarata PPV ojo 1. Descanso absoluto. Sin temas nuevos.',color:'var(--accent2)'},
  5:{badge:'🏥 CIRUGÍA 2',desc:'Recuperación + cirugía ojo 2. Descanso absoluto.',color:'var(--accent2)'},
  6:{badge:'🏥 CIRUGÍA 3',desc:'Recuperación post-operatoria. Sin temas nuevos.',color:'var(--accent2)'},
  16:{badge:'🔴 DESCANSO',desc:'Semana de consolidación. Solo repasos ligeros.',color:'var(--accent2)'},
  24:{badge:'🔴 DESCANSO',desc:'Semana de consolidación antes del repaso final.',color:'var(--accent2)'},
  25:{badge:'⚡ REPASO 1',desc:'Repaso intensivo. Sin temas nuevos. Simulacros a lo bestia.',color:'#ffdd6a'},
  26:{badge:'⚡ REPASO 2',desc:'Repaso intensivo. Corrección de errores.',color:'#ffdd6a'},
  27:{badge:'🟢 PRE-EXAMEN',desc:'Descanso activo. Solo fórmulas y audios. Examen el 15 feb.',color:'var(--accent3)'}
};
function planLocalDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function expandCourseIntoWeeklySessions(ids, course, targetWeeks = PLAN_STUDY_WEEK_COUNT){
  if(ids.length >= targetWeeks) return ids;
  const extras = targetWeeks - ids.length;
  const parts=ids.map(()=>1);
  const heavy=/identidades|funciones|ecuaciones|dinámica|energía|electrodinámica|triángulos|circunferencia|analítica|cónicas|divisibilidad|combinatorio/i;
  const heavyFirst=ids.map((id,index)=>({id,index})).filter(item=>heavy.test(TOPICS[course]?.[item.id]||'')).map(item=>item.index);
  const order=[...heavyFirst,...ids.map((_,index)=>index).filter(index=>!heavyFirst.includes(index))];
  // Primero se divide cada tema una vez, dando preferencia a los más exigentes.
  // Si todavía faltan sesiones, solo los temas pesados reciben una tercera parte.
  for(let i=0;i<Math.min(extras,ids.length);i++)parts[order[i]]++;
  for(let i=ids.length;i<extras;i++)parts[heavyFirst[(i-ids.length)%heavyFirst.length]??order[(i-ids.length)%order.length]]++;
  return ids.flatMap((id,index)=>{
    const total=parts[index]; if(total===1)return[id];
    const original=TOPICS[course]?.[id];
    return Array.from({length:total},(_,part)=>{
      const sessionId=id+'__part'+(part+1);
      PLAN_PARTS[sessionId] = { course, name: original+' · Parte '+(part+1)+'/'+total };
      return sessionId;
    });
  });
}

    
// ── PLAN SEMANAL: cada ciencia aparece todas las semanas ──

function buildWeeklyStudyPlan(){
  const assignments=Array.from({length:PLAN_TOTAL_WEEKS},()=>[]);

  // Limpiar SOLO el registro de partes. TOPICS nunca se toca.
  Object.keys(PLAN_PARTS).forEach(k => delete PLAN_PARTS[k]);

  // ── CIENCIAS ──
  for(const course of PLAN_COURSES){
    const originalIds=Object.keys(TOPICS[course]||{})
      .filter(id=>!id.includes('__part'));
    const ids = expandCourseIntoWeeklySessions(originalIds, course);
    let cursor=0;

    PLAN_STUDY_WEEK_NUMBERS.forEach((weekNumber,studyIndex)=>{
      const weeksLeft=PLAN_STUDY_WEEK_COUNT-studyIndex;
      const count=Math.ceil((ids.length-cursor)/weeksLeft);

      assignments[weekNumber-1].push(
        ...ids.slice(cursor,cursor+count)
      );

      cursor+=count;
    });
  }

  // ── HUMANIDADES: CURSOS TODAS LAS SEMANAS ──
  const HUMANITIES_ALL_WEEKS=[
    'Raz. Matemático',
    'Raz. Verbal',
    'Lenguaje',
    'Inglés',
    'Economía',
    'Geografía',
    'Literatura'
  ];

  // ── HUMANIDADES: SOLO SEMANAS IMPARES ──
  const HUMANITIES_ODD_ONLY=[
    'Historia del Perú',
    'Filosofía'
  ];

  // ── HUMANIDADES: SOLO SEMANAS PARES ──
  const HUMANITIES_EVEN_ONLY=[
    'Historia Universal',
    'Psicología'
  ];

  function distributeHumanities(courses,weeks){
    for(const course of courses){
      const originalIds=Object.keys(TOPICS[course]||{})
        .filter(id=>!id.includes('__part'));

      if(!originalIds.length)continue;

      const ids=expandCourseIntoWeeklySessions(originalIds,course, weeks.length);
      let cursor=0;

      weeks.forEach((weekNumber,studyIndex)=>{
        const weeksLeft=weeks.length-studyIndex;
        const count=Math.ceil((ids.length-cursor)/weeksLeft);

        assignments[weekNumber-1].push(
          ...ids.slice(cursor,cursor+count)
        );

        cursor+=count;
      });
    }
  }

  const HUMANITIES_ODD_WEEKS = PLAN_STUDY_WEEK_NUMBERS.filter((_, i) => i % 2 === 0);
  const HUMANITIES_EVEN_WEEKS = PLAN_STUDY_WEEK_NUMBERS.filter((_, i) => i % 2 === 1);

  distributeHumanities(HUMANITIES_ALL_WEEKS, PLAN_STUDY_WEEK_NUMBERS);
  distributeHumanities(HUMANITIES_ODD_ONLY, HUMANITIES_ODD_WEEKS);
  distributeHumanities(HUMANITIES_EVEN_ONLY, HUMANITIES_EVEN_WEEKS);

  // ── RECONSTRUIR PLAN ──
  Object.keys(WEEKS_TOPICS).forEach(key=>delete WEEKS_TOPICS[key]);

  WSCHED.length=0;
  OP_WEEKS.splice(0,OP_WEEKS.length,'w4','w5','w6','w16','w24');

  Object.keys(WEEK_HOURS).forEach(key=>delete WEEK_HOURS[key]);

  const host=document.getElementById('weeklyStudyPlan');
  if(!host)return;



  const start=new Date(PLAN_START+'T12:00:00');

  const format=d=>
    d.toLocaleDateString('es-PE',{day:'numeric',month:'short'})
      .replace('.','');

  host.innerHTML=assignments.map((topics,index)=>{
    const weekNumber=index+1;
    const id='w'+weekNumber;
    const s=addDays(start,index*7);
    const rawEnd=addDays(s,6);

    const finalEnd=
      rawEnd>new Date(SCHEDULE_END+'T12:00:00')
        ?new Date(SCHEDULE_END+'T12:00:00')
        :rawEnd;

    const special=PLAN_SPECIAL_WEEKS[weekNumber];

const specialHours={
  4:0,5:0,6:0,
  16:0,
  24:0,
  25:8,26:8,27:4
};

    WEEK_HOURS[id]=specialHours[weekNumber]??8;

    WEEKS_TOPICS[id]=topics;

    WSCHED.push({
      id,
      s:planLocalDate(s),
      e:planLocalDate(finalEnd),
      topics
    });

    const courseSummary=Object.keys(TOPICS)
      .filter(course=>topics.some(topic=>TOPICS[course]?.[topic]))
      .join(' · ');

    const isStudy=!special;

    const badge=
      isStudy
        ?'🔵 ESTUDIO'
        :special.badge;

    const badgeColor=
      isStudy
        ?'var(--accent4)'
        :special.color;

    const desc=
      isStudy
        ?'Semana '+(PLAN_STUDY_WEEK_NUMBERS.indexOf(weekNumber)+1)+' de temario nuevo · '+topics.length+' temas distribuidos entre las materias.'
        :special.desc;

    return '<div class="week'+(isStudy?'':' op')+'" id="week-'+id+'" onclick="tw(this)" data-dates="'+format(s)+' – '+format(finalEnd)+'"><div class="wtop"><span class="wdates">Semana '+weekNumber+' · '+format(s)+' – '+format(finalEnd)+'</span><span class="wc" style="background:#19192b;color:'+badgeColor+';border:1px solid #34345b">'+badge+'</span>'+(isStudy?'<span class="hbadge">'+courseSummary+'</span>':'')+'<span class="wprog" id="wp-'+id+'"></span><span class="chev">▼</span></div><div class="wdesc">'+desc+'</div><div class="wtopics" id="tp-'+id+'"></div></div>';
  }).join('');
}
const EXAM_DATE='2027-02-15';
const STUDY_DAYS=[1,2,3,4,5,6]; // 0=dom, 1=lun... (domingo NO cuenta)

// ── HORARIO SEMANAL ALTERNADO ──
// El lunes 10 de agosto de 2026 es la semana 1 (impar). A partir de allí las
// plantillas se alternan automáticamente cada lunes.
const SCHEDULE_START='2026-08-10';
const SCHEDULE_END='2027-02-15';
const SCHEDULE_DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const SCHEDULE_TIMES=['8:00','8:50','9:42','10:00','10:50','11:35','12:45','1:45','2:37','3:54','4:24','4:47','5:40','6:40','7:40','8:00','8:52','11:30'];
const REST='Descanso', SHORT='Descanso corto', MID='Descanso medio', LONG='Descanso largo';
const SCHEDULE_ODD=[
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['Repaso de Física','Repaso de Geometría','Repaso de Química','Repaso de Física','Repaso de Geometría','Repaso de Química',REST],
  [SHORT,SHORT,SHORT,SHORT,SHORT,SHORT,REST],
  ['Tema Física Parte 1','Tema Geometría Parte 1','Tema Química Parte 1','Tema Física Parte 2','Tema Geometría Parte 2','Tema Química Parte 2',REST],
  [SHORT,SHORT,SHORT,SHORT,SHORT,SHORT,REST],
  ['Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores',REST],
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['Repaso de Trigonometría','Repaso de Álgebra','Repaso de Aritmética','Repaso de Trigonometría','Repaso de Álgebra','Repaso de Aritmética',REST],
  [SHORT,SHORT,SHORT,SHORT,SHORT,SHORT,REST],
  ['Tema Trigo Parte 1','Tema Álgebra Parte 1','Tema Aritmética Parte 1','Tema Trigo Parte 2','Tema Álgebra Parte 2','Tema Aritmética Parte 2',REST],
  [MID,MID,MID,MID,MID,MID,REST],
  ['Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores',REST],
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['RM','RV','RM','RV','RM','RV',REST],
  [MID,MID,MID,MID,MID,MID,REST],
  ['Lenguaje','Inglés','Economía','Geografía','Historia del Perú','Literatura','Filosofía'],
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['Dormir','Dormir','Dormir','Dormir','Dormir','Dormir',REST]
];
const SCHEDULE_EVEN=[
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['Repaso de Física','Repaso de Geometría','Repaso de Química','Repaso de Física','Repaso de Geometría','Repaso de Química',REST],
  [SHORT,SHORT,SHORT,SHORT,SHORT,SHORT,REST],
  ['Tema Física Parte 1','Tema Geometría Parte 1','Tema Química Parte 1','Tema Física Parte 2','Tema Geometría Parte 2','Tema Química Parte 2',REST],
  [SHORT,SHORT,SHORT,SHORT,SHORT,SHORT,REST],
  ['Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores',REST],
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['Repaso de Trigonometría','Repaso de Álgebra','Repaso de Aritmética','Repaso de Trigonometría','Repaso de Álgebra','Repaso de Aritmética',REST],
  [SHORT,SHORT,SHORT,SHORT,SHORT,SHORT,REST],
  ['Tema Trigo Parte 1','Tema Álgebra Parte 1','Tema Aritmética Parte 1','Tema Trigo Parte 2','Tema Álgebra Parte 2','Tema Aritmética Parte 2',REST],
  [MID,MID,MID,MID,MID,MID,REST],
  ['Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores','Prueba y errores',REST],
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['RM','RV','RM','RV','RM','RV',REST],
  [MID,MID,MID,MID,MID,MID,REST],
  ['Lenguaje','Inglés','Economía','Geografía','Historia Universal','Literatura','Psicología'],
  [LONG,LONG,LONG,LONG,LONG,LONG,REST],
  ['Dormir','Dormir','Dormir','Dormir','Dormir','Dormir',REST]
];
let scheduleWeekOffset=0;
function isoDate(date){return date.toISOString().slice(0,10);}
function mondayOf(date){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
function addDays(date,n){const d=new Date(date);d.setDate(d.getDate()+n);return d;}
function scheduleWeekFor(ds){
  const start=new Date(SCHEDULE_START+'T12:00:00'); const date=new Date(ds+'T12:00:00');
  const diff=Math.floor((mondayOf(date)-start)/86400000); if(diff<0||ds>SCHEDULE_END)return null;
  const number=Math.floor(diff/7)+1; return{number,template:number%2?'impar':'par',start:addDays(start,(number-1)*7)};
}

function scheduleClass(text){
  if(!text)return '';
  const s=text.toLowerCase();
  if(text===REST||s.includes('descanso'))return 'sg-rest';
  if(text==='Dormir')return 'sg-sleep';
  if(s.includes('prueba'))return 'sg-test';
  // Ciencias
  if(s.includes('física'))return 'sg-phys';
  if(s.includes('geometr'))return 'sg-geo';
  if(s.includes('química'))return 'sg-chem';
  if(s.includes('trigo'))return 'sg-trig';
  if(s.includes('álgebra'))return 'sg-alg';
  if(s.includes('aritmética'))return 'sg-arith';
  // Humanidades (orden importa: Historia del Perú ANTES que Historia Universal)
  if(s.includes('historia del perú'))return 'sg-hp';
  if(s.includes('historia universal'))return 'sg-hu';
  if(text==='RM')return 'sg-rm';
  if(text==='RV')return 'sg-verbal';
  if(s.includes('literatura'))return 'sg-literature';
  if(s.includes('lenguaje'))return 'sg-language';
  if(s.includes('economia')||s.includes('economía'))return 'sg-eco';
  if(s.includes('geografia')||s.includes('geografía'))return 'sg-geog';
  if(s.includes('filosofía')||s.includes('filosofia'))return 'sg-filo';
  if(s.includes('psicolog'))return 'sg-psych';
  if(s.includes('inglés')||s.includes('ingles'))return 'sg-english';
  return '';
}

function moveScheduleWeek(delta){
  scheduleWeekOffset += delta;
  renderStudySchedule();
}
function renderStudySchedule(){
  const el=document.getElementById('studySchedule');if(!el)return;
  const base=new Date(SCHEDULE_START+'T12:00:00'); const rangeEnd=new Date(SCHEDULE_END+'T12:00:00'); const current=mondayOf(new Date());
  const first=current<base?base:(current>rangeEnd?mondayOf(rangeEnd):current); const weekStart=addDays(first,scheduleWeekOffset*7);
  if(weekStart<base){scheduleWeekOffset=Math.ceil((base-first)/604800000);return renderStudySchedule();}
  if(weekStart>rangeEnd){scheduleWeekOffset=Math.floor((mondayOf(rangeEnd)-first)/604800000);return renderStudySchedule();}
  const info=scheduleWeekFor(isoDate(weekStart)); if(!info)return;
  const kind = info.template==='impar' ? 'odd' : 'even';
  const template = getSchedTpl(kind);
  const end=addDays(weekStart,6); const fmt=d=>d.toLocaleDateString('es-PE',{day:'numeric',month:'short'}).replace('.','');
  let grid='<div class="schedule-grid"><div class="sg-head">Hora</div>'+SCHEDULE_DAYS.map((d,i)=>'<div class="sg-head">'+d+'<br><span style="font-weight:400;color:var(--muted)">'+fmt(addDays(weekStart,i))+'</span></div>').join('');
  SCHEDULE_TIMES.forEach((time,row)=>{
    grid+='<div class="sg-time">'+time+'</div>';
    template[row].forEach((item,dow)=>{
      const cls=scheduleClass(item);
      const course=getCourseForCell(item,row,dow);
      const dateDs=localKey(addDays(weekStart,dow));
      const key=dateDs+'::'+row;
      const done=!!((S.scheduleChecks||{})[key]);
      const isCheck=!!course && dow!==6;
      const safeItem=(item||'').replace(/"/g,'&quot;');
      const isMovable=_schedEditMode && item!=='Dormir' && dow!==6;
      grid+='<div class="'+cls+(isCheck?' sg-check':'')+(done?' done':'')+' sg-cell"'
        +' data-row="'+row+'" data-dow="'+dow+'" data-kind="'+kind+'"'
        +' data-item="'+safeItem+'"'
        +' data-has-check="'+(isCheck?'1':'0')+'"'
        +(isCheck?' data-key="'+key+'"':'')
        +(isMovable?' draggable="true"':'')
        +' title="'+dateDs+' · '+time+'">'+item
        +(isCheck?'<span class="sg-check-mark">'+(done?'✓':'○')+'</span>':'')
        +'</div>';
    });
  });
  grid+='</div>';
  el.innerHTML='<div class="schedule-head"><div class="schedule-title">Horario semanal · semana '+info.number+' ('+info.template+')</div><div class="schedule-meta">'+fmt(weekStart)+' – '+fmt(end)+' · periodo: 10 ago 2026 – 15 feb 2027</div><button class="schedule-nav" onclick="moveScheduleWeek(-1)">←</button><button class="schedule-nav" onclick="moveScheduleWeek(1)">→</button></div><div class="schedule-scroll">'+grid+'</div><div class="schedule-note">La plantilla superior se aplica en semanas impares; la inferior, en semanas pares. El calendario cubre hasta el 15 de febrero de 2027.</div>';
  attachScheduleDragHandlers(el);

}
function findFirstPendingTopicOfCourse(course){
  const td=today();
  const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);
  if(!aw)return null;
  return aw.topics.find(id=>{
    const c=getTopic(id).course;
    return c===course && !(S.t||{})[id]?.done;
  })||null;
}
function toggleScheduleCheck(key){
  if(!key) return;
  if(!S.scheduleChecks) S.scheduleChecks={};
  S.scheduleChecks[key]=!S.scheduleChecks[key];
  save();
  renderStudySchedule();
  syncPlanFromDay(key);
}

function syncPlanFromDay(key){
  const parts=key.split('::');
  const ds=parts[0];
  const row=Number(parts[1]);
  const info=scheduleWeekFor(ds);
  if(!info)return;
  const template=getSchedTpl(info.template==='impar'?'odd':'even');
  const dow=dowFromDs(ds);
  if(dow===6)return;
  const course=getCourseForCell(template[row][dow],row,dow);
  if(!course||!SCHEDULE_COURSE_ROWS[course])return;
  const fieldMap=SESION_FIELD[course];
  const field=fieldMap[dow];
  if(!field)return;
  const rows=SCHEDULE_COURSE_ROWS[course];
  const allDone=rows.every(r=>S.scheduleChecks[ds+'::'+r]);
  const topicId=findFirstPendingTopicOfCourse(course);
  if(!topicId)return;
  if(!S.t)S.t={};S.t[topicId]=S.t[topicId]||{};
  S.t[topicId][field]=allDone;
  if(field==='done'&&allDone)S.t[topicId].completedAt=Date.now();
  save();renderT();
}
function markSessionBlocks(course, sessionIdx, value){
  const td=today();
  const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);
  if(!aw)return;
  const info=scheduleWeekFor(td);
  if(!info)return;
  const dowMap={ 'Física':[0,3],'Geometría':[1,4],'Química':[2,5],'Trigonometría':[0,3],'Álgebra':[1,4],'Aritmética':[2,5] };
  const dow=dowMap[course]?.[sessionIdx];
  if(dow===undefined)return;
  const rows=SCHEDULE_COURSE_ROWS[course];
  if(!rows)return;
  const monday=addDays(new Date(info.start),0);
  const dateDs=localKey(addDays(monday,dow));
  if(!S.scheduleChecks)S.scheduleChecks={};
  rows.forEach(r=>{ S.scheduleChecks[dateDs+'::'+r]=value; });
  save();renderStudySchedule();
}
async function load(){
  try{
    let raw=localStorage.getItem(KEY);
    if(!raw){
      for(const old of['uni-luis-v8','uni-luis-v11']){
        const prev=localStorage.getItem(old);
        if(prev){raw=prev;break;}
      }
    }
    S=JSON.parse(raw||'{}');
  }catch(e){S={}}
  // Migración one-shot: si hay fc en localStorage, moverlo a IDB
  if(Array.isArray(S.fc)&&S.fc.length){
    console.log('Migrando '+S.fc.length+' flashcards a IDB...');
    try{
      const db=await openDB();
      const tx=db.transaction(FC_STORE,'readwrite');
      const store=tx.objectStore(FC_STORE);
      await new Promise((res,rej)=>{
        const r=store.put(S.fc,'fc');
        r.onsuccess=res;r.onerror=()=>rej(r.error);
      });
      await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});
      db.close();
      delete S.fc;
      localStorage.setItem(KEY,JSON.stringify(S));
      console.log('Migración OK, localStorage liberado');
    }catch(e){console.error('Error migrando fc:',e);}
  }
  // Cargar fc desde IDB
  try{
    const db=await openDB();
    const tx=db.transaction(FC_STORE,'readonly');
    const store=tx.objectStore(FC_STORE);
    const fc=await new Promise((res,rej)=>{
      const r=store.get('fc');
      r.onsuccess=()=>res(r.result);
      r.onerror=()=>rej(r.error);
    });
    db.close();
    S.fc=Array.isArray(fc)?fc:[];
  }catch(e){
    console.error('Error cargando fc de IDB:',e);
    S.fc=S.fc||[];
  }
  migrateData();
  if(!S._migFcV2){migrateFcTopicsV2();S._migFcV2=true;save();}
}
let _fcSaveTimer=null;
async function _flushFCSave(){
  try{
    const db=await openDB();
    const tx=db.transaction(FC_STORE,'readwrite');
    const store=tx.objectStore(FC_STORE);
    await new Promise((res,rej)=>{
      const r=store.put(S.fc||[],'fc');
      r.onsuccess=res;r.onerror=()=>rej(r.error);
    });
    await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});
    db.close();
  }catch(e){console.error('FC save error:',e);}
}
function save(){
  try{
    S._v=DATA_VERSION;
    S._savedAt=Date.now();
    // meta (todo menos fc) → localStorage
    const {fc, ...meta}=S;
    localStorage.setItem(KEY,JSON.stringify(meta));
    showSaveIndicator();
    renderSyncHint();
    // fc → IndexedDB, debounced
    clearTimeout(_fcSaveTimer);
    _fcSaveTimer=setTimeout(_flushFCSave,1500);
    schedulePush();
  }catch(e){console.error('save error:',e);}
}
// Flush al cerrar/minimizar para no perder el último rating
window.addEventListener('pagehide',()=>{
  if(_fcSaveTimer){clearTimeout(_fcSaveTimer);_flushFCSave();}
  if(_syncDebounce){clearTimeout(_syncDebounce);pushToCloud();}
});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'&&_fcSaveTimer){clearTimeout(_fcSaveTimer);_flushFCSave();}
});
function migrateData(){
  if(!S||typeof S!=='object')S={};
  if(!S.fcConfig)S.fcConfig={newPerDay:20,reviewPerDay:200};
  if(!S.fcToday)S.fcToday={date:'',newDone:0,reviewDone:0};
  if(!S.speedTargets)S.speedTargets={};
  if(!S.exCount)S.exCount={};
  if(!S.simLog)S.simLog=[];
  if(!S.checklist)S.checklist={};
  if(!S.sessions)S.sessions=[];
  if(!S.dailySegments)S.dailySegments={};
  if(!S.scheduleChecks)S.scheduleChecks={};
  // v13: descartar plantilla de horario personalizada si quedó desactualizada
  // (contiene "Repasar todo" en la fila 15 o "Historia del Perú" junto a RM/RV en fila 13)
  if(S.schedTpl && S.schedTpl.odd){
    const fila13=S.schedTpl.odd[13]||[];
    const fila15=S.schedTpl.odd[15]||[];
    const esVieja = fila15.includes('Repasar todo') || fila13.includes('Historia del Perú');
    if(esVieja){
      console.log('Migración: descartando S.schedTpl viejo (plantilla pre-v13)');
      delete S.schedTpl;
    }
  }
  if(S._v>=DATA_VERSION){migrateSessionsFromHours();return;}
  S._v=DATA_VERSION;
  migrateSessionsFromHours();
  if(S.fc)S.fc.forEach(c=>{
  if(c.ease===undefined)c.ease=2.5;
  if(c.interval===undefined)c.interval=0;
  if(c.due===undefined)c.due=today();
  if(c.state===undefined)c.state='new';
  if(c.reps===undefined)c.reps=0;
  if(c.lapses===undefined)c.lapses=0;
  if(c.etiquetas===undefined)c.etiquetas=[];
});
}
function migrateSessionsFromHours(){
  if((S.sessions||[]).length)return;
  // Only migrate if there are actual hour records to pull from
  if(!S.h)return;
  const keys=Object.keys(S.h||{}).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&(S.h[k]||0)>0);
  if(!keys.length)return;
  keys.sort((a,b)=>b.localeCompare(a));
  for(const k of keys.slice(0,80)){
    const segs=(S.dailySegments||{})[k]||{};
    const courses=Object.keys(segs);
    if(courses.length){
      for(const course of courses){
        const data=segs[course];
        const secs=(data.teoria||0)+(data.ejercicios||0)+(data.repaso||0);
        if(secs<30)continue;
        const type=(data.teoria||0)>=(data.ejercicios||0)&&(data.teoria||0)>=(data.repaso||0)?'teoria':(data.ejercicios||0)>=(data.repaso||0)?'ejercicios':'repaso';
        S.sessions.push({date:k,course,topic:'',type,energy:'media',secs,ts:0,fromHours:true});
      }
    }else{
      S.sessions.push({date:k,course:'',topic:'',type:'teoria',energy:'media',secs:S.h[k],ts:0,fromHours:true});
    }
  }
  S.sessions.sort((a,b)=>b.date.localeCompare(a.date)||((b.ts||0)-(a.ts||0)));
  if(S.sessions.length>200)S.sessions=S.sessions.slice(0,200);
  if(S.sessions.length)save();
}
/* ═══ MIGRACIÓN v2: Física/Química — reasignar flashcards y limpiar estado huérfano ═══ */
function migrateFcTopicsV2(){
  const MAP_FISICA = {
    'Cap. I · Análisis dimensional':'Cap. I · Análisis dimensional',
    'Cap. II · Análisis vectorial':'Cap. II · Análisis vectorial',
    'Cap. III · Cinemática 1D':'Cap. III · Cinemática',
    'Cap. IV · Cinemática 2D':'Cap. III · Cinemática',
    'Cap. V · Gráficas del movimiento':'Cap. III · Cinemática',
    'Cap. VI · Estática':'Cap. IV · Estática',
    'Cap. VII · Dinámica':'Cap. V · Dinámica',
    'Cap. VIII · Trabajo mecánico y energía':'Cap. VII · Energía',
    'Cap. IX · Impulso y movimiento':'Cap. VIII · Cantidad de movimiento',
    'Cap. X · Gravitación':'Cap. XII · Gravitación universal',
    'Cap. XI · Oscilaciones':'Cap. XI · Movimiento armónico simple (MAS)',
    'Cap. XII · Ondas mecánicas':'Cap. XI · Movimiento armónico simple (MAS)',
    'Cap. XIII · Estática de fluidos':'Cap. X · Estática de fluidos',
    'Cap. XIV · Fenómenos térmicos':'Cap. XIII · Calor',
    'Cap. XV · Termodinámica':'Cap. XIV · Termodinámica',
    'Cap. XVI · Electrostática':'Cap. XV · Electrostática',
    'Cap. XVII · Electrodinámica':'Cap. XVI · Electrodinámica',
    'Cap. XVIII · Electromagnetismo':'Cap. XVIII · Electromagnetismo',
    'Cap. XIX · Ondas electromagnéticas':'Cap. XVIII · Electromagnetismo',
    'Cap. XX · Óptica geométrica':'Cap. XIX · Óptica',
    'Cap. XXI · Física moderna':'Cap. XX · Física moderna'
  };
  const MAP_QUIMICA = {
    'Cap. I · Materia':'Cap. I · Materia y energía',
    'Cap. II · Modelos atómicos':'Cap. II · Teoría atómica y estructura moderna',
    'Cap. III · Estructura atómica':'Cap. II · Teoría atómica y estructura moderna',
    'Cap. IV · Modelo cuántico':'Cap. III · Números cuánticos y configuración',
    'Cap. V · Configuración electrónica':'Cap. III · Números cuánticos y configuración',
    'Cap. VI · Tabla periódica':'Cap. IV · Tabla periódica',
    'Cap. VII · Enlace químico':'Cap. V · Enlace químico',
    'Cap. VIII · Geometría molecular':'Cap. V · Enlace químico',
    'Cap. IX · Fuerzas intermoleculares':'Cap. V · Enlace químico',
    'Cap. X · Nomenclatura inorgánica':'Cap. VI · Nomenclatura inorgánica',
    'Cap. XI · Cálculos en química':'Cap. VIII · Unidades químicas de masa',
    'Cap. XII · Estados de la materia':'Cap. X · Estado gaseoso',
    'Cap. XIII · Estado sólido':'Cap. XI · Líquidos y sólidos',
    'Cap. XIV · Estado líquido':'Cap. XI · Líquidos y sólidos',
    'Cap. XV · Estado gaseoso':'Cap. X · Estado gaseoso',
    'Cap. XVI · Mezcla de gases':'Cap. X · Estado gaseoso',
    'Cap. XVII · Reacciones químicas':'Cap. XII · Reacciones químicas',
    'Cap. XVIII · Estequiometría':'Cap. XIII · Estequiometría',
    'Cap. XIX · Peso equivalente':'Cap. XIII · Estequiometría',
    'Cap. XX · Sistemas dispersos':'Cap. XIV · Soluciones',
    'Cap. XXI · Cinética química':'Cap. XV · Cinética y equilibrio químico',
    'Cap. XXII · Equilibrio químico':'Cap. XV · Cinética y equilibrio químico',
    'Cap. XXIII · Ácidos y bases':'Cap. XVI · Ácidos y bases',
    'Cap. XXIV · Celdas electrolíticas':'Cap. XVII · Electroquímica',
    'Cap. XXV · Electroquímica':'Cap. XVII · Electroquímica',
    'Cap. XXVI · Química orgánica':'Cap. XVIII · Química orgánica',
    'Cap. XXVII · Funciones oxigenadas':'Cap. XVIII · Química orgánica',
    'Cap. XXVIII · Funciones nitrogenadas':'Cap. XVIII · Química orgánica',
    'Cap. XXIX · Aromáticos':'Cap. XVIII · Química orgánica',
    'Cap. XXX · Química aplicada':'Cap. XIX · Ecología, química descriptiva y aplicada'
  };
  const MAPS={'Física':MAP_FISICA,'Química':MAP_QUIMICA};

  function renameStr(s,map){
    if(typeof s!=='string')return s;
    let out=s;
    const entries=Object.entries(map).sort((a,b)=>b[0].length-a[0].length);
    for(const[v,n]of entries){
      if(v===n)continue;
      out=out.split(v).join(n);
    }
    return out;
  }

  // 1) Flashcards — reasignar por nombre (se conservan todas)
  let fcN=0;
  (S.fc||[]).forEach(c=>{
    const map=MAPS[c.course];
    if(!map)return;
    const nuevo=map[c.topic];
    if(nuevo&&nuevo!==c.topic){
      c.topic=nuevo;
      if(Array.isArray(c.etiquetas))c.etiquetas=[...new Set(c.etiquetas.map(e=>renameStr(e,map)))];
      fcN++;
    }
  });

  // 2) Banco de problemas — reasignar por nombre
  let bankN=0;
  (S.bank||[]).forEach(b=>{
    const map=MAPS[b.course];
    if(!map||!b.tema)return;
    const nuevo=map[b.tema];
    if(nuevo&&nuevo!==b.tema){b.tema=nuevo;bankN++;}
  });

  // 3) Limpiar estado huérfano de Física/Química
  //    Los IDs f1..f21 y q1..q30 cambiaron de significado → hay que resetear.
  const cursosCien=['Física','Química'];
  let stN=0;
  if(S.t)Object.keys(S.t).forEach(id=>{
    const info=TOPIC_INDEX[id];
    if(info&&cursosCien.includes(info.course)){delete S.t[id];stN++;}
    else if(!info&&/^[fq]\d+$/.test(id)){delete S.t[id];stN++;}
  });
  ['exCount','capErrors'].forEach(k=>{
    if(S[k])Object.keys(S[k]).forEach(id=>{
      const info=TOPIC_INDEX[id];
      if((info&&cursosCien.includes(info.course))||(!info&&/^[fq]\d+$/.test(id)))delete S[k][id];
    });
  });
  if(S.speedSessions)S.speedSessions=S.speedSessions.filter(s=>!cursosCien.includes(s.course));
  if(S.errors)S.errors=S.errors.filter(e=>!e.match(/^\[([fq]\d+)\]/));
  if(S.topicTime)Object.keys(S.topicTime).forEach(k=>{
    const[c]=k.split('::');
    if(cursosCien.includes(c))delete S.topicTime[k];
  });

  console.log('✓ Migración v2 — flashcards renombradas:',fcN,'· banco:',bankN,'· caps reseteados:',stN);
}

function today(){const d=new Date();return d.getFullYear()+'-'+(String(d.getMonth()+1).padStart(2,'0'))+'-'+(String(d.getDate()).padStart(2,'0'))}
function wkey(){const d=new Date();d.setHours(0,0,0,0);const day=d.getDay();const diff=day===0?-6:1-day;d.setDate(d.getDate()+diff);return d.getFullYear()+'-'+(String(d.getMonth()+1).padStart(2,'0'))+'-'+(String(d.getDate()).padStart(2,'0'))}
function localKey(d){return d.getFullYear()+'-'+(String(d.getMonth()+1).padStart(2,'0'))+'-'+(String(d.getDate()).padStart(2,'0'))}
function fmt(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=Math.floor(s%60);return h+'h '+m+'m '+String(sec).padStart(2,'0')+'s'}
function daysBetween(a,b){return Math.round((new Date(b)-new Date(a))/86400000)}

// ── VIEWS ──
function closeSidebar(){
  if(isMobileLayout())document.body.classList.remove('sidebar-open');
}
function showView(name, btn){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.sb-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  if(btn)btn.classList.add('active');
  closeSidebar();
  if(name==='home')renderHome();
  if(name==='stats')renderStats();
  if(name==='sessions'){renderSessions();}
  if(name==='bank'){renderBank();}
  if(name==='flashcards'){renderFC();}
  if(name==='calendar'){renderCalendar();}
  if(name==='notes'){document.getElementById('globalNotes').value=S.globalNotes||'';}
}
function saveGlobalNotes(){S.globalNotes=document.getElementById('globalNotes').value;save();}

// ── COUNTDOWN + STREAK ──
function updateSidebar(){
  const days=Math.max(0,daysBetween(today(),EXAM_DATE));
  document.getElementById('sbDays').textContent=days;
  // streak
  let streak=0,d=new Date();
  while(true){
    const k=localKey(d);
    if((S.h||{})[k]&&(S.h[k]>0)){streak++;d.setDate(d.getDate()-1);}
    else break;
  }
  document.getElementById('sbStreak').textContent=streak;
  S.streak=streak;
  // mini errors
  const errs=S.errors||[];
  const el=document.getElementById('sbErrList');
  if(!errs.length){el.innerHTML='<div style="font-size:.72rem;color:var(--muted)">Sin errores aún.</div>';return;}
  const countEl=document.getElementById('sbErrCount');
  if(countEl)countEl.textContent=errs.length?errs.length+'':'';
  const sample=errs.slice(0,3);
  el.innerHTML=sample.map(e=>'<div class="sme-item">'+e+'</div>').join('');
}

// ── DETECT WEEK + ALERTS ──
function detectWeek(){
  const td=today();
  const scheduled=scheduleWeekFor(td);
  const scheduleAlert=document.getElementById('alertBox');
  const rem=Math.max(0,Math.ceil(daysBetween(td,EXAM_DATE)/7));
  const statSemsEl=document.getElementById('statSems');
  if(statSemsEl)statSemsEl.textContent=rem;
  if(scheduled){
    document.getElementById('subtitle-date').textContent='Hoy: '+td+' · Semana '+scheduled.number+' ('+scheduled.template+') · '+rem+' semanas para el examen UNI ('+EXAM_DATE+')';
        if(scheduleAlert)scheduleAlert.innerHTML='<div class="alert-box alert-ok"><div class="alert-dot"></div><span>Horario activo: <strong>semana '+scheduled.number+' ('+scheduled.template+')</strong>. '+(scheduled.template==='impar'?'Se muestra la plantilla superior.':'Se muestra la plantilla inferior.')+'</span></div>';
    renderStudySchedule();
    renderAllWeekProgress();
    return;
  }
  if(td<SCHEDULE_START){
    document.getElementById('subtitle-date').textContent='El horario alternado inicia el lunes 10 de agosto de 2026.';
    if(scheduleAlert)scheduleAlert.innerHTML='<div class="alert-box alert-ok"><div class="alert-dot"></div><span>El plan inicia el <strong>lunes 10 de agosto de 2026</strong>. La primera semana usa la plantilla superior.</span></div>';
    renderStudySchedule();
    renderAllWeekProgress();
    return;
  }
   document.getElementById('subtitle-date').textContent='Hoy: '+td+' · Examen UNI: '+EXAM_DATE+' · '+rem+' semanas restantes';
  let aw=null;
  for(const w of WSCHED){if(td>=w.s&&td<=w.e){aw=w;break;}}
  const ab=document.getElementById('alertBox');
  if(aw){
    document.querySelectorAll('.week.now').forEach(el=>el.classList.remove('now','ex'));
    const el=document.getElementById('week-'+aw.id);
    if(el){
      el.classList.add('now','ex');
      setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'center'}),400);
      const total=aw.topics.length;
      const done=aw.topics.filter(id=>(S.t||{})[id]?.done).length;
      const dl=Math.max(1,daysBetween(td,aw.e)+1);
      const need=Math.ceil((total-done)/dl);
      // alert
      let alertClass='alert-ok', alertMsg;
      if(OP_WEEKS.includes(aw.id)){
        alertClass='alert-warn';
        alertMsg='🔴 Semana de recuperación (<strong>'+aw.id+'</strong>). Sin meta de caps — prioridad descanso / lectura ligera.';
      }else{
        alertMsg='Semana activa. <strong>'+done+'/'+total+'</strong> caps · ~<strong>'+need+' caps/día</strong> para terminar a tiempo.';
        if(need>5){alertClass='alert-danger';alertMsg='⚠ Vas atrasado. Necesitas <strong>'+need+' caps/día</strong> para terminar '+aw.id+' a tiempo.';}
        else if(need>3){alertClass='alert-warn';alertMsg='Ritmo ajustado. ~<strong>'+need+' caps/día</strong> para completar esta semana.';}
      }
      ab.innerHTML='<div class="alert-box '+alertClass+'"><div class="alert-dot"></div><span>'+alertMsg+'</span></div>';
    }
  } else if(td>EXAM_DATE){
    ab.innerHTML='<div class="alert-box alert-ok"><div class="alert-dot"></div><span>¡Exámenes completados! 🎉</span></div>';
  } else {
    ab.innerHTML='<div class="alert-box alert-warn"><div class="alert-dot"></div><span>Fuera de semana activa. Revisa el plan.</span></div>';
  }
  // no-study alert (skip guilt on op weeks)
  const lastStudyDays=getLastStudyDays();
  const onOp=aw&&OP_WEEKS.includes(aw.id);
  if(lastStudyDays>1&&lastStudyDays<30&&!onOp){
    ab.innerHTML+='<div class="alert-box alert-danger"><div class="alert-dot"></div><span>Llevas <strong>'+lastStudyDays+' días</strong> sin registrar horas de estudio.</span></div>';
  }
  renderAllWeekProgress();
  renderDailyCapsGoal();
  renderPlanHealth();
  renderYesterdaySummary();
}
function renderAllWeekProgress(){
  const td=today();
  for(const w of WSCHED){
    const wp=document.getElementById('wp-'+w.id);
    if(!wp)continue;
    const total=w.topics.length;
    const done=w.topics.filter(id=>(S.t||{})[id]?.done).length;
    if(td>=w.s&&td<=w.e){
      const dl=Math.max(1,daysBetween(td,w.e)+1);
      const need=Math.ceil((total-done)/dl);
      wp.textContent=done+'/'+total+' · ~'+need+'/día';
    }else if(td>w.e){
      wp.textContent=done+'/'+total+(done===total?' ✓':'');
    }else{
      wp.textContent=total+' caps';
    }
  }
}
function getLastStudyDays(){
  if(!S.h)return 999;
  let d=new Date(),days=0;
  while(days<30){
    const k=localKey(d);
    if(S.h[k]&&S.h[k]>0)return days;
    d.setDate(d.getDate()-1);
    if(STUDY_DAYS.includes(d.getDay()))days++;
  }
  return days;
}

// ── RHYTHM ──
function updateRhythm(){
  const td=today();
  if(!S.h)return;
  const hoy=S.h[td]||0;
  const w=WSCHED.find(w=>td>=w.s&&td<=w.e);
  const mh=w?getWeekTargetHours(w.id):6;
  const ms=mh*3600;
  document.getElementById('rMeta').textContent=fmt(ms);
  document.getElementById('rLlevas').textContent=fmt(hoy);
  const diff=hoy-ms;const rs=document.getElementById('rStatus');
  if(Math.abs(diff)<1800){rs.textContent='a tiempo';rs.className='rs rs-ok';}
  else if(diff>0){rs.textContent='+'+fmt(diff)+' adelantado';rs.className='rs rs-ahead';}
  else{rs.textContent=fmt(-diff)+' pendiente';rs.className='rs rs-behind';}
}

// ── TOPIC CHECK ──
function ck2(e,id){
  e.stopPropagation();
  if(!S.t)S.t={};S.t[id]=S.t[id]||{};
  S.t[id].done2=!S.t[id].done2;
  S.t[id].ls2=Date.now();
  const info=findTopicInfo(id);
  if(info.curso)markSessionBlocks(info.curso,1,S.t[id].done2);
  renderT();save();ls();renderStudySchedule();
}
function ck(e,id){
  e.stopPropagation();
  if(!S.t)S.t={};S.t[id]=S.t[id]||{};
  const wasDone=S.t[id].done;
  S.t[id].done=!wasDone;S.t[id].ls=Date.now();
  if(!wasDone)S.t[id].completedAt=Date.now();
 
  const nw=document.getElementById('notes-'+id);
  if(nw&&S.t[id].done)nw.classList.add('on');
    // weekly caps — contar solo los completados dentro de esta semana
  const wk2=wkey();if(!S.ws)S.ws={};S.ws[wk2]=S.ws[wk2]||{h:0,caps:0,errors:0};
  const wkStart=new Date(wk2+'T12:00:00');
  const wkEnd=new Date(wkStart);wkEnd.setDate(wkEnd.getDate()+6);
  let capsThisWeek=0;
  for(const[id2,data2]of Object.entries(S.t||{})){
    if(data2.done&&data2.completedAt){
      const cd=new Date(data2.completedAt);
      if(cd>=wkStart&&cd<=wkEnd)capsThisWeek++;
    }
  }
  S.ws[wk2].caps=capsThisWeek;
  // MEJORA 1: revisión espaciada — programar cuando se completa
  if(!wasDone && S.t[id].done){
    const goal=getExGoal(id);
    const ex=getExCount(id);
    if(ex<15&&!confirm('Solo llevas '+ex+'/'+goal+' ejercicios en este cap. ¿Marcarlo completado igual?')){
      S.t[id].done=false;
      delete S.t[id].completedAt;
      renderT();save();return;
    }
    const now=Date.now();
    const reviews=getReviewIntervals(id);
    S.t[id].reviewDates=reviews.map(d=>localKey(new Date(now+d*86400000)));
    S.t[id].reviewsDone=[];
  }
  renderT();save();prog();ls();updateRhythm();detectWeek();
  renderSpacedReviewAlert();
  renderAllExBadges();
  const info=findTopicInfo(id);
  if(info.curso)markSessionBlocks(info.curso,0,S.t[id].done);
  if(weekPendingFilter)filterWeekPending(true);
}
function sd(e,id){
  e.stopPropagation();
  if(!S.t)S.t={};S.t[id]=S.t[id]||{};
  const cyc={f:'m',m:'p',p:'f'};
  S.t[id].diff=cyc[S.t[id].diff]||'f';S.t[id].ls=Date.now();
  renderT();save();ls();renderExBadge(id);
}
let currentPlanTab='ciencias';

function setPlanTab(tab){
  currentPlanTab=tab;
  document.querySelectorAll('.plan-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const host=document.getElementById('weeklyStudyPlan');
  if(host){
    host.classList.toggle('tab-ciencias',tab==='ciencias');
    host.classList.toggle('tab-letras',tab==='letras');
  }
  S.planTab=tab;
  save();
  updateTabBadges();
}

function updateTabBadges(){
  const SCIENCE=['Aritmética','Álgebra','Física','Geometría','Trigonometría','Química'];
  const showSciences=currentPlanTab==='ciencias';
  const td=today();

  for(const w of WSCHED){
    const weekEl=document.getElementById('week-'+w.id);
    if(!weekEl)continue;

    // Filtrar los topics según el tab
    const visibleTopics=w.topics.filter(id=>{
      const course=getTopic(id).course;
      return SCIENCE.includes(course)===showSciences;
    });

    // Actualizar badge de cursos (.hbadge)
    const hb=weekEl.querySelector('.hbadge');
    if(hb){
      const courses=[...new Set(
        visibleTopics.map(id=>getTopic(id).course)
      )].filter(Boolean);
      hb.textContent=courses.join(' · ');
    }

    // Actualizar progreso semanal (.wprog)
    const wp=document.getElementById('wp-'+w.id);
    if(wp){
      const total=visibleTopics.length;
      const done=visibleTopics.filter(id=>(S.t||{})[id]?.done).length;
      if(td>=w.s&&td<=w.e){
        const dl=Math.max(1,daysBetween(td,w.e)+1);
        const need=Math.ceil((total-done)/dl);
        wp.textContent=done+'/'+total+' · ~'+need+'/día';
      }else if(td>w.e){
        wp.textContent=done+'/'+total+(done===total&&total>0?' ✓':'');
      }else{
        wp.textContent=total+' caps';
      }
    }
  }
}
function renderT(){
  if(!S.t)return;
  for(const[id,data]of Object.entries(S.t)){
    const el=document.querySelector('[data-id="'+id+'"]');if(!el)continue;
    const ck=el.querySelector('.tck');
    if(data.done){el.classList.add('done');ck.textContent='✓';}
    else{el.classList.remove('done');ck.textContent='';}
    const ck2=el.querySelector('.tck2');
    if(ck2){
      if(data.done2){ck2.classList.add('done');ck2.textContent='✓';}
      else{ck2.classList.remove('done');ck2.textContent='';}
    }
    const db=el.querySelector('.db-cycle');
    if(db){
      db.classList.remove('df','dm','dp');
      const lbs={f:'fácil ◆',m:'medio ◆',p:'pesado ◆'};
      db.textContent=lbs[data.diff]||'◆';
      if(data.diff==='f')db.classList.add('df');
      else if(data.diff==='m')db.classList.add('dm');
      else if(data.diff==='p')db.classList.add('dp');
    }
    if(data.note){const nw=document.getElementById('notes-'+id);const ni=nw?.querySelector('.tnote-input');if(ni){ni.value=data.note;nw.classList.add('on');}}
    if(data.done){const nw=document.getElementById('notes-'+id);if(nw)nw.classList.add('on');}
  }
}
function saveNote(id,val){if(!S.t)S.t={};S.t[id]=S.t[id]||{};S.t[id].note=val;save();}

// ── PROGRESS ──
function prog(){
  const all=document.querySelectorAll('.ti[data-id]');
  const done=document.querySelectorAll('.ti[data-id].done').length;
  const pct=all.length?Math.round(done/all.length*100):0;
  document.getElementById('pfill').style.width=pct+'%';
  document.getElementById('ppct').textContent=pct+'%';
  document.getElementById('sCaps').textContent=pct+'%';
}

// ── LAST STUDIED ──
function ls(){
  if(!S.t)return;
  const now=Date.now();
  for(const[id,data]of Object.entries(S.t)){
    const el=document.getElementById('tl-'+id);if(!el)continue;
    const lastTs=Math.max(data.ls||0,data.ls2||0);
    if(!lastTs)continue;
    const d=Math.floor((now-lastTs)/86400000);
    if(d===0){el.textContent='hoy';el.className='tlast';}
    else if(d===1){el.textContent='ayer';el.className='tlast';}
    else{el.textContent='hace '+d+'d';el.className='tlast'+(d>=7?' warn':'');}
  }
}

// ── WEEK TOGGLE ──
function tw(el){if(el.style.cursor==='default')return;el.classList.toggle('ex');}

// ── VIEW MODES ──
let currentViewMode='normal', diffFilter=false, oldFilter=false;
function setViewMode(mode){
  currentViewMode=mode;diffFilter=false;oldFilter=false;weekPendingFilter=false;
  document.getElementById('vcNormal').classList.toggle('active',mode==='normal');
  document.getElementById('vcCompact').classList.toggle('active',mode==='compact');
  document.getElementById('vcWeekPending')?.classList.remove('active');
  document.querySelectorAll('.week').forEach(w=>{
    w.classList.toggle('compact-hide',mode==='compact');
    w.classList.remove('print-hide');
    if(mode==='compact')w.classList.remove('ex');
  });
  document.querySelectorAll('.ti').forEach(ti=>ti.style.display='');
}
function filterDiff(){
  diffFilter=!diffFilter;oldFilter=false;
  document.getElementById('vcDiff').classList.toggle('active',diffFilter);
  document.getElementById('vcOld').classList.remove('active');
  document.querySelectorAll('.ti[data-id]').forEach(ti=>{
    const id=ti.dataset.id;const data=(S.t||{})[id]||{};
    if(diffFilter)ti.style.display=(data.diff==='p')?'':'none';
    else ti.style.display='';
    if(diffFilter&&data.diff==='p'){const w=ti.closest('.week');if(w)w.classList.add('ex');}
  });
}
function filterOld(){
  oldFilter=!oldFilter;diffFilter=false;
  document.getElementById('vcOld').classList.toggle('active',oldFilter);
  document.getElementById('vcDiff').classList.remove('active');
  const now=Date.now();
  document.querySelectorAll('.ti[data-id]').forEach(ti=>{
    const id=ti.dataset.id;const data=(S.t||{})[id]||{};
    if(oldFilter){
      const days=data.ls?Math.floor((now-data.ls)/86400000):999;
      const show=days>=7||!data.ls;
      ti.style.display=show?'':'none';
      if(show){const w=ti.closest('.week');if(w)w.classList.add('ex');}
    } else ti.style.display='';
  });
}
function filterByPage(){
  const p=prompt('Ingresa la página Lumbreras (ej: 289):');
  if(!p)return;
  document.getElementById('searchinput').value='p.'+p;
  doSearch('p.'+p);
}

// ── POMODORO ──
let pInt=null,pSec=1500,pRun=false,pEl=0,pStart=null;
let curStype='teoria', curEnergy='alta';
function setStype(t){curStype=t;document.querySelectorAll('.stype-btn[id^=stype]').forEach(b=>b.classList.remove('active'));document.getElementById('stype-'+t)?.classList.add('active');}
function setEnergy(e){curEnergy=e;document.querySelectorAll('.stype-btn[id^=se]').forEach(b=>b.classList.remove('active'));document.getElementById('se-'+e)?.classList.add('active');}
function initPomo(){
  if(S.pomo?.running&&S.pomo?.startTs){
    const el=Math.floor((Date.now()-S.pomo.startTs)/1000);
    pSec=Math.max(0,(S.pomo.sec||1500)-el);pEl=S.pomo.elapsed||0;
    if(pSec>0)startPomoTimer();else pSec=1500;
  }else{pSec=S.pomo?.sec||1500;}upPD();
  // Initialize with active topic if selectors are empty
  const pcourseSel=document.getElementById('pcourse');
  const ptopicSel=document.getElementById('ptopic');
  if(pcourseSel&&!pcourseSel.value&&ptopicSel&&!ptopicSel.value){
    initPomoWithActiveTopic();
  }
}
function startPomoTimer(){
  pRun=true;pStart=Date.now();document.getElementById('bstart').classList.add('on');
  // visually disable break button while studying
  const bb=document.getElementById('bbreak');
  if(bb){bb.style.opacity='0.35';bb.style.cursor='not-allowed';}
  const secAtStart=pSec;const elAtStart=pEl;
  pInt=setInterval(()=>{
    const elapsed=Math.floor((Date.now()-pStart)/1000);
    pSec=Math.max(0,secAtStart-elapsed);
    pEl=elAtStart+elapsed;
    S.pomo={running:true,sec:pSec,elapsed:pEl,startTs:pStart};
    save();upPD();
    if(pSec<=0){playZenAlarm();pa('stop');}
  },1000);
}
function adjPomo(mins){
  if(pRun)return;
  pSec=Math.max(300,Math.min(7200,pSec+mins*60));
  upPD();
}
function getBreakSuggestion(workSecs){
  if(workSecs<=0)return '';
  const workMins=Math.round(workSecs/60);
  // Based on research: ~1 min rest per 5 min work, but capped at 30 for long sessions
  const rawBreak=Math.round(workMins/3);
  const breakMins=Math.max(5,Math.min(30,rawBreak));
  if(workMins<=25)return '☕ descanso aprox. '+breakMins+' min';
  if(workMins<=50)return '🚶 descanso aprox. '+breakMins+' min';
  return '😴 sesión larga — descansa '+breakMins+' min';
}
function pa(a){
  if(a==='start'){
    if(pRun)return;
    // stop any active break when starting a new pomodoro
    if(brkRun)stopBreak(false);
    pStart=Date.now();startPomoTimer();S.pomo={running:true,sec:pSec,elapsed:pEl,startTs:pStart};save();
  }
  else if(a==='pause'){if(!pRun)return;pRun=false;clearInterval(pInt);document.getElementById('bstart').classList.remove('on');const bbp=document.getElementById('bbreak');if(bbp){bbp.style.opacity='1';bbp.style.cursor='pointer';}S.pomo={running:false,sec:pSec,elapsed:pEl};save();}
  else if(a==='stop'){
    clearInterval(pInt);pRun=false;document.getElementById('bstart').classList.remove('on');const bbst=document.getElementById('bbreak');if(bbst){bbst.style.opacity='1';bbst.style.cursor='pointer';}
    const course=document.getElementById('pcourse').value;
    const topic=document.getElementById('ptopic')?.value||'';
    let recBreakSecs=0;
    if(pEl>30){
      // compute recommended break and store it alongside the session
      const workMins=Math.round(pEl/60);
      const rawBreak=Math.round(workMins/5);
      recBreakSecs=Math.max(5,Math.min(30,rawBreak))*60;
      logH(pEl,course,recBreakSecs);
      logSession(pEl,course,topic,curStype,curEnergy);
      // auto-start break timer with recommended duration
      if(recBreakSecs>0)startBreak(recBreakSecs);
    }
    // show break suggestion based on elapsed time
    const bsEl=document.getElementById('pomoBreakSug');
    if(bsEl&&pEl>30)bsEl.textContent=getBreakSuggestion(pEl);
    pEl=0;pSec=1500;S.pomo={running:false,sec:1500,elapsed:0};save();upPD();
  }
}
function upPD(){
  const m=String(Math.floor(pSec/60)).padStart(2,'0'),s=String(pSec%60).padStart(2,'0');
  const str=m+':'+s;
  document.getElementById('pdisp').textContent=str;document.getElementById('ftimer').textContent=str;
  document.getElementById('pstatus').textContent=pRun?'● corriendo':'';
  // always show break suggestion for current timer when not running
  const bsEl=document.getElementById('pomoBreakSug');
  if(bsEl&&!pRun)bsEl.textContent=getBreakSuggestion(pSec);
  else if(bsEl&&pRun)bsEl.textContent='';
}

// ── ALARMA ZEN ──
function playZenAlarm(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    function zt(freq,start,dur,gain){
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type='sine';o.frequency.setValueAtTime(freq,ctx.currentTime+start);
      g.gain.setValueAtTime(gain,ctx.currentTime+start);
      g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+start+dur);
      o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur+0.05);
    }
    zt(528,0,2.2,0.55);zt(660,0.04,1.8,0.2);zt(396,0.08,1.5,0.1);
  }catch(e){}
}

// ── HORAS ──
// secs = effective study time; recBreakSecs = recommended break for this session (stored but not in effective count)
function logH(secs,course,recBreakSecs){
  if(!S.h)S.h={};const td=today(),wk2=wkey();
  // effective hours (study only)
  S.h[td]=(S.h[td]||0)+secs;
  S.h['w'+wk2]=(S.h['w'+wk2]||0)+secs;
  if(course)S.h['c'+course]=(S.h['c'+course]||0)+secs;
  if(!S.h.total)S.h.total=0;S.h.total+=secs;
  // recommended break hours (separate, for total-day display only)
  if(recBreakSecs){
    if(!S.hBreak)S.hBreak={};
    S.hBreak[td]=(S.hBreak[td]||0)+recBreakSecs;
    if(!S.hBreak.total)S.hBreak.total=0;
    S.hBreak.total+=recBreakSecs;
  }
  if(!S.ws)S.ws={};S.ws[wk2]=S.ws[wk2]||{h:0,caps:0,errors:0};
  S.ws[wk2].h=(S.ws[wk2].h||0)+secs;save();renderH();updateRhythm();renderWS();
}
// course color bases (rgb) for segmented bars
  

function segColor(rgb,shade){
  // shade: 0=dark(teoria), 1=mid(ejercicios), 2=light(repaso)
  const [r,g,b]=rgb;
  const f=[0.65,0.88,1.12][shade];
  return'rgb('+Math.min(255,Math.round(r*f))+','+Math.min(255,Math.round(g*f))+','+Math.min(255,Math.round(b*f))+')';
}
function renderH(){
  if(!S.h){
    // still update break/total displays with zeros
    const el1=document.getElementById('hBreakToday');const el2=document.getElementById('hTotalToday');
    if(el1)el1.textContent='0h 0m 00s';if(el2)el2.textContent='0h 0m 00s';
    return;
  }
  const td=today(),wk2=wkey();
  const efSecs=S.h[td]||0;
  const brkSecs=(S.hBreak||{})[td]||0;
  const totalDaySecs=efSecs+brkSecs;
  const sem=fmt(S.h['w'+wk2]||0);
  document.getElementById('sHoy').textContent=fmt(efSecs);
  document.getElementById('sSem').textContent=sem;
  document.getElementById('hHoy').textContent=fmt(efSecs);
  document.getElementById('hBreakToday').textContent=fmt(brkSecs);
  document.getElementById('hTotalToday').textContent=fmt(totalDaySecs);
  document.getElementById('hSem').textContent='esta semana: '+sem;
  document.getElementById('statTotalH').textContent=fmt(S.h.total||0);
  const cs=['Aritmética','Álgebra','Física','Geometría','Trigonometría','Química','Historia','Geografia','Filosofía','Literatura','Lenguaje','RV','RM','Ingles'];
  // Use today's daily segments for the bar chart
  const daySegs=(S.dailySegments||{})[td]||{};
  // Compute total for each course from daily segments
  const dayTotals=cs.map(c=>{
    const segs=daySegs[c]||{teoria:0,ejercicios:0,repaso:0};
    return segs.teoria+segs.ejercicios+segs.repaso;
  });
  const mx=Math.max(...dayTotals,1);
  document.getElementById('hcourses').innerHTML=cs.map((c,i)=>{
    const segs=daySegs[c]||{teoria:0,ejercicios:0,repaso:0};
    const total=dayTotals[i];if(!total)return'';
    const rgb=COURSE_RGB[c]||[150,150,200];
    const pTe=Math.round(segs.teoria/mx*100);
    const pEx=Math.round(segs.ejercicios/mx*100);
    const pRe=Math.round(segs.repaso/mx*100);
    const teW=Math.round(segs.teoria/total*100);
    const exW=Math.round(segs.ejercicios/total*100);
    const reW=100-teW-exW;
    const outerW=Math.round(total/mx*100);
    const cTe=segColor(rgb,0),cEx=segColor(rgb,1),cRe=segColor(rgb,2);
    let legend='';
    if(segs.teoria>0)legend+='<span style="color:'+cTe+';font-size:.66rem">■ teoría '+fmt(segs.teoria)+'</span> ';
    if(segs.ejercicios>0)legend+='<span style="color:'+cEx+';font-size:.66rem">■ ejer. '+fmt(segs.ejercicios)+'</span> ';
    if(segs.repaso>0)legend+='<span style="color:'+cRe+';font-size:.66rem">■ repaso '+fmt(segs.repaso)+'</span>';
    return'<div class="hrow" style="margin-bottom:.08rem"><span>'+c+'</span><span>'+fmt(total)+'</span></div>'
      +'<div style="display:flex;gap:1px;height:5px;width:100%;background:var(--border);margin-bottom:.05rem">'
      +'<div style="width:'+outerW+'%;display:flex;gap:1px">'
      +(segs.teoria>0?'<div style="flex:'+teW+';background:'+cTe+';height:5px;min-width:1px"></div>':'')
      +(segs.ejercicios>0?'<div style="flex:'+exW+';background:'+cEx+';height:5px;min-width:1px"></div>':'')
      +(segs.repaso>0?'<div style="flex:'+reW+';background:'+cRe+';height:5px;min-width:1px"></div>':'')
      +'</div></div>'
      +'<div style="margin-bottom:.35rem;line-height:1.3">'+legend+'</div>';
  }).join('');
  // all-time per course totals
  const mxTotal=Math.max(...cs.map(c=>S.h['c'+c]||0),1);
  document.getElementById('hcourses-total').innerHTML=cs.map(c=>{
    const s=S.h['c'+c]||0;if(!s)return'';
    const rgb=COURSE_RGB[c]||[150,150,200];
    const col='rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
    return'<div class="hrow"><span>'+c+'</span><span>'+fmt(s)+'</span></div>'
      +'<div class="hbar"><div class="hbarfill" style="width:'+Math.round(s/mxTotal*100)+'%;background:'+col+'"></div></div>';
  }).join('');
  // Promedio h/día esta semana (lun–sáb, solo días transcurridos)
  let totalWeek=0,eligWeek=0;
  const _tw=new Date();
  const _dw=(_tw.getDay()+6)%7;
  for(let i=0;i<=_dw;i++){
    const d=new Date(_tw);d.setDate(d.getDate()-i);
    if(!STUDY_DAYS.includes(d.getDay()))continue;
    eligWeek++;
    totalWeek+=S.h[localKey(d)]||0;
  }
  document.getElementById('statAvgH').textContent=fmt(eligWeek?Math.round(totalWeek/eligWeek):0);
  // consistency — semana actual (desde el lunes hasta hoy, sin domingos)
  let studyDays=0,eligibleDays=0;
  const _t=new Date();
  const _dow=(_t.getDay()+6)%7; // 0=lun, 6=dom
  for(let i=0;i<=_dow;i++){
    const d=new Date(_t);d.setDate(d.getDate()-i);
    if(!STUDY_DAYS.includes(d.getDay()))continue;
    eligibleDays++;
    if((S.h[localKey(d)]||0)>0)studyDays++;
  }
  document.getElementById('statConsist').textContent=(eligibleDays?Math.round(studyDays/eligibleDays*100):0)+'%';
}

// ── SESSIONS ──
function logSession(secs,course,topic,type,energy){
  if(!S.sessions)S.sessions=[];
  S.sessions.unshift({date:today(),course,topic:topic||'',type,energy,secs,ts:Date.now()});
  if(S.sessions.length>200)S.sessions=S.sessions.slice(0,200);
  // accumulate by topic
  if(topic){
    if(!S.topicTime)S.topicTime={};
    const k=course+'::'+topic;
    if(!S.topicTime[k])S.topicTime[k]={total:0,teoria:0,ejercicios:0,repaso:0};
    S.topicTime[k].total=(S.topicTime[k].total||0)+secs;
    S.topicTime[k][type]=(S.topicTime[k][type]||0)+secs;
        // NUEVO: extender ventana de repaso con el pomodoro
    const topicId = findTopicIdByCourseAndName(course, topic);
    if(topicId){
      const meta = ensureTopicMetadata(topicId);
      meta.fechaUltimoEstudio = today();
    }
  }
  // accumulate by course+type for segmented bars (daily)
  const td=today();
  if(!S.dailySegments)S.dailySegments={};
  if(!S.dailySegments[td])S.dailySegments[td]={};
  if(!S.dailySegments[td][course])S.dailySegments[td][course]={teoria:0,ejercicios:0,repaso:0};
  S.dailySegments[td][course][type]=(S.dailySegments[td][course][type]||0)+secs;
  save();
  // refresh topic time badges in plan view
  renderTopicTimes();
}
function renderSessions(){
  migrateSessionsFromHours();
  const sessions=S.sessions||[];
  const el=document.getElementById('sessionLog');
  if(!el)return;
  const colors={
    'Aritmética':'var(--ca)','Álgebra':'var(--calg)','Física':'var(--cf)',
    'Geometría':'var(--cg)','Trigonometría':'var(--ct)','Química':'var(--cq)',
    'Raz. Matemático':'var(--crm)','Raz. Verbal':'var(--crv)',
    'Historia Universal':'var(--chu)','Historia del Perú':'var(--chp)',
    'Geografía':'var(--cge)','Filosofía':'var(--cfi)',
    'Literatura':'var(--cli)','Lenguaje':'var(--cle)','Inglés':'var(--cin)',
    'RV':'var(--crv)','RM':'var(--crm)','Historia':'var(--chu)',
    'Ingles':'var(--cin)','Economía':'var(--crm)','Actualidad':'var(--cle)',
    'Psicología':'var(--cfi)',
    'Simulacros':'#ffdd6a'
  };
    const energyEmoji={alta:'🔥',media:'🟡',baja:'💤'};
  if(!sessions.length){
    el.innerHTML='<div style="font-size:.6rem;color:var(--muted);padding:.3rem;line-height:1.5">Sin sesiones registradas aún.<br>Termina un pomodoro (&gt;30 s) en Estadísticas para guardar fecha, curso, tipo, energía y horas.</div>';
    return;
  }
  el.innerHTML=sessions.map(s=>{
    const col=colors[s.course]||'#888';
    const courseLbl=courseLabel(s.course||'(sin curso)');
    const topicLabel=s.topic?'<span style="font-size:.68rem;color:var(--muted);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+s.topic+'</span>':'<span style="flex:1"></span>';
    const mig=s.fromHours?' <span style="font-size:.64rem;color:var(--border)">· hist.</span>':'';
    return'<div class="session-item"><span class="session-date">'+s.date+'</span><span class="session-course" style="background:transparent;color:'+col+';border:1px solid '+col+'">'+courseLbl+'</span>'+topicLabel+'<span class="session-detail">'+fmt(s.secs||0)+'</span><span class="session-type-badge">'+(s.type||'—')+'</span><span class="session-energy">'+(energyEmoji[s.energy]||'🟡')+mig+'</span></div>';
  }).join('');
}
function clearSessions(){if(confirm('¿Limpiar historial de sesiones?')){S.sessions=[];save();renderSessions();}}

// ── ERRORES (v13 enhanced) ──
let _errCourseFilter='';
function clearErrCourseFilter(){
  _errCourseFilter='';
  document.getElementById('errCourseFilter').style.display='none';
  renderE();
}
function filterErrByCourse(course){
  _errCourseFilter=(_errCourseFilter===course)?'':course;
  renderE();
}
function renderErrByCourseGrid(){
  const el=document.getElementById('errByCourseGrid');
  if(!el)return;
  const COURSE_COLORS={Aritmética:'var(--ca)',Álgebra:'var(--calg)',Física:'var(--cf)',Geometría:'var(--cg)',Trigonometría:'var(--ct)',Química:'var(--cq)',HistoriaUniversal:'var(--chu)',HistoriaDelPerú:'var(--chp)',Geografía:'var(--cge)',Filosofía:'var(--cfi)',Literatura:'var(--cli)',Lenguaje:'var(--cle)',Inglés:'var(--cin)',Economía:'var(--crm)',Psicología:'var(--cfi)','Raz. Matemático':'var(--crm)','Raz. Verbal':'var(--crv)'};
  const capErrs=S.capErrors||{};
  const byCourse={};Object.keys(TOPICS).forEach(name=>byCourse[name]=0);
  // Count from capErrors (by topic id -> course)
  Object.entries(capErrs).forEach(([id,arr])=>{
    if(!arr||!arr.length)return;
    const c=getTopic(id).course||null;
    if(c&&byCourse[c]!==undefined)byCourse[c]+=arr.length;
  });
  // Count from global errors with [id] prefix (chapter errors)
  (S.errors||[]).forEach(e=>{
    const match=e.match(/^\[([a-z]+\d*)\]/);
    if(match){
      const id=match[1];
      const c=getTopic(id).course||null;
      if(c&&byCourse[c]!==undefined&&capErrs[id]===undefined)byCourse[c]++;
    }
  });
  // Count from global errors with [Course] prefix (course-specific global errors)
  (S.errors||[]).forEach(e=>{
    const match=e.match(/^\[([A-Za-záéíóúÁÉÍÓÚñÑ\s]+)\]\s*/);
    if(match){
      const c=match[1];
      if(byCourse[c]!==undefined)byCourse[c]++;
    }
  });
  // Count truly general errors (no prefix at all)
  const generalErrors=(S.errors||[]).filter(e=>!e.match(/^\[/));
  if(generalErrors.length>0){
    byCourse['General']=generalErrors.length;
  }
 el.innerHTML=Object.keys(TOPICS).map(name=>{
  const n=byCourse[name]||0;
  const col=COURSE_COLORS[name]||'#888';
  const active=_errCourseFilter===name;
    return'<div class="ecc" onclick="filterErrByCourse(\''+name+'\')" title="Filtrar errores de '+name+'" style="'+(active?'border-color:var(--accent2);background:#250f0f':'')+'">'
      +'<div class="ecc-name" style="color:'+col+'">'+courseLabel(name)+'</div>'
      +(n>0?'<div class="ecc-num">'+n+'</div>':'<div class="ecc-zero">✓</div>')
      +'</div>';
  }).join('')+(byCourse['General']?'<div class="ecc" onclick="filterErrByCourse(\'General\')" title="Filtrar errores generales" style="'+(_errCourseFilter==='General'?'border-color:var(--accent2);background:#250f0f':'')+'">'
      +'<div class="ecc-name" style="color:var(--muted)">General</div>'
      +'<div class="ecc-num">'+byCourse['General']+'</div>'
      +'</div>':'');
}
// ═══ TIPO DE ERROR ═══
const ERR_TYPE_CYCLE = ['', 'conceptual', 'procedimental', 'calculo', 'lectura', 'atencion'];
const ERR_TYPE_META = {
  conceptual:     { icon:'🧠', label:'conceptual',    color:'#a855f7', tip:'Volvé a la teoría del capítulo antes de más práctica.' },
  procedimental:  { icon:'📐', label:'procedimental', color:'#38bdf8', tip:'Trabajá el procedimiento paso a paso, sin saltarte pasos.' },
  calculo:        { icon:'🔢', label:'cálculo',       color:'#f59e0b', tip:'Reforzá con repeticiones mecánicas y menos teoría nueva.' },
  lectura:        { icon:'📖', label:'lectura',       color:'#14b8a6', tip:'Practicá subrayado y lectura lenta del enunciado.' },
  atencion:       { icon:'⚠',  label:'atención',      color:'#ef4444', tip:'Chequeá signos y datos antes de responder.' }
};

function cycleErrType(errorText){
  if(!errorText)return;
  if(!S.errType)S.errType={};
  const cur = S.errType[errorText] || '';
  const next = ERR_TYPE_CYCLE[(ERR_TYPE_CYCLE.indexOf(cur)+1) % ERR_TYPE_CYCLE.length];
  if(next) S.errType[errorText] = next;
  else delete S.errType[errorText];
  save();
  renderE();
}

function renderErrTypeStats(){
  const el = document.getElementById('errTypeStats');
  if(!el) return;
  const errs = S.errors || [];
  if(!errs.length){ el.innerHTML = ''; return; }

  const counts = {};
  let sinTipo = 0;
  errs.forEach(e => {
    const t = (S.errType || {})[e];
    if(t && ERR_TYPE_META[t]) counts[t] = (counts[t] || 0) + 1;
    else sinTipo++;
  });
  const total = errs.length;

  let html = '<div style="font-size:.66rem;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem">Tipo de error</div>';
  Object.entries(ERR_TYPE_META).forEach(([k, meta]) => {
    const n = counts[k] || 0;
    const pct = total ? Math.round(n/total*100) : 0;
    html += '<div style="display:flex;align-items:center;gap:.4rem;font-size:.70rem;padding:.15rem 0">'
      + '<span style="width:1rem;text-align:center">' + meta.icon + '</span>'
      + '<span style="color:var(--muted);width:6rem">' + meta.label + '</span>'
      + '<div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">'
      + '<div style="width:' + pct + '%;height:100%;background:' + meta.color + '"></div>'
      + '</div>'
      + '<span style="min-width:2rem;text-align:right;color:' + (n ? 'var(--text)' : 'var(--muted)') + '">' + n + '</span>'
      + '</div>';
  });
  if(sinTipo){
    const pct = Math.round(sinTipo/total*100);
    html += '<div style="display:flex;align-items:center;gap:.4rem;font-size:.70rem;padding:.15rem 0;opacity:.55">'
      + '<span style="width:1rem;text-align:center">○</span>'
      + '<span style="color:var(--muted);width:6rem">sin clasificar</span>'
      + '<div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">'
      + '<div style="width:' + pct + '%;height:100%;background:var(--muted)"></div>'
      + '</div>'
      + '<span style="min-width:2rem;text-align:right">' + sinTipo + '</span>'
      + '</div>';
  }

  const top = Object.entries(ERR_TYPE_META)
    .map(([k, meta]) => ({ k, ...meta, n: counts[k] || 0 }))
    .sort((a, b) => b.n - a.n)[0];
  if(top && top.n >= 3){
    html += '<div style="font-size:.66rem;color:var(--muted);margin-top:.5rem;padding-top:.4rem;border-top:1px solid var(--border);line-height:1.5">'
      + 'Tu tipo dominante es <strong style="color:' + top.color + '">' + top.label + '</strong>. ' + top.tip
      + '</div>';
  }
  el.innerHTML = html;
}
// ═══ FIN TIPO DE ERROR ═══


function renderE(){
  const errs=S.errors||[];const ercnt=S.errcnt||{};
  document.getElementById('statErrCount').textContent=errs.length;
  // Render by-course grid
  renderErrByCourseGrid();
  // Filter by course if active
  let displayErrs=errs;
  const filterEl=document.getElementById('errCourseFilter');
  const filterLbl=document.getElementById('errCourseFilterLabel');
  if(_errCourseFilter){
    if(filterEl)filterEl.style.display='block';
    if(filterLbl)filterLbl.textContent=_errCourseFilter;
    displayErrs=errs.filter(e=>{
      const match=e.match(/^\[([a-z]+\d*)\]/);
      if(match){
        return getTopic(match[1]).course===_errCourseFilter;
      }
      // Check for [Course] prefix (global errors with course)
      const courseMatch=e.match(/^\[([A-Za-záéíóúÁÉÍÓÚñÑ\s]+)\]\s*/);
      if(courseMatch){
        return courseMatch[1]===_errCourseFilter;
      }
      // For General filter, show errors without any prefix
      if(_errCourseFilter==='General')return !match && !courseMatch;
      return false;
    });
    if(!displayErrs.length)displayErrs=errs; // fallback show all
  }else{
    if(filterEl)filterEl.style.display='none';
  }
  const COURSE_COLORS={Aritmética:'var(--ca)',Álgebra:'var(--calg)',Física:'var(--cf)',Geometría:'var(--cg)',Trigonometría:'var(--ct)',Química:'var(--cq)'};
  document.getElementById('elist').innerHTML=displayErrs.length
    ?displayErrs.map((e,i)=>{
      const realIdx=errs.indexOf(e);
      const match=e.match(/^\[([a-z]+\d*)\]/);
      const courseMatch=e.match(/^\[([A-Za-záéíóúÁÉÍÓÚñÑ\s]+)\]\s*/);
      let courseTag='';
      let displayText=e;
      if(match){
        const c=getTopic(match[1]).course||'';
        const col=COURSE_COLORS[c]||'#888';
        if(c)courseTag='<span style="font-size:.64rem;padding:.02rem .22rem;background:'+col+'18;border:1px solid '+col+'40;color:'+col+';margin-right:.25rem;flex-shrink:0">'+c+'</span>';
        displayText=e.replace(/^\[[^\]]+\]\s*/,'');
      }else if(courseMatch){
        const c=courseMatch[1];
        const col=COURSE_COLORS[c]||'#888';
        courseTag='<span style="font-size:.64rem;padding:.02rem .22rem;background:'+col+'18;border:1px solid '+col+'40;color:'+col+';margin-right:.25rem;flex-shrink:0">'+c+'</span>';
        displayText=e.replace(/^\[[^\]]+\]\s*/,'');
      }else{
        // General error (no prefix)
        courseTag='<span style="font-size:.64rem;padding:.02rem .22rem;background:var(--border);border:1px solid var(--muted);color:var(--muted);margin-right:.25rem;flex-shrink:0">General</span>';
      }
      const tipo = (S.errType||{})[e] || '';
      const tmeta = ERR_TYPE_META[tipo] || { icon:'○', color:'var(--muted)' };
      const safeErr = e.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');
      return'<div class="eitem"><div class="edot"></div>'+courseTag
        +'<span onclick="cycleErrType(\''+safeErr+'\')" title="tipo: '+(tipo||'sin clasificar')+' — clic para cambiar" style="cursor:pointer;font-size:.68rem;padding:.02rem .3rem;border:1px solid '+tmeta.color+'50;background:'+tmeta.color+'18;border-radius:3px;color:'+tmeta.color+';margin-right:.3rem;flex-shrink:0;user-select:none">'+tmeta.icon+'</span>'
        +'<span>'+displayText+'</span><span class="ecnt">'+(ercnt[realIdx]||1)+'x</span><span class="edel" onclick="delE('+realIdx+')">✕</span></div>';
    }).join('')
    :'<div style="font-size:.6rem;color:var(--muted);padding:.3rem">Sin errores aún.</div>';
   document.getElementById('ferrlist').innerHTML=errs.length?errs.map(e=>'<div>· '+e+'</div>').join(''):'—';
  renderMath(document.getElementById('elist'));
  updateSidebar();
  renderErrTypeStats();
  // Update home if visible
  if(document.getElementById('view-home')?.classList.contains('active')){
    renderHomeErrores();renderHomeErrCurso();renderHomeErrRecientes();
  }
}
// ── ERROR PRESETS ──
const ERROR_PRESETS={
  Aritmética:['Error de cálculo','Error de signo','Confusión de regla/propiedad','Mal planteamiento','Error en conversión de unidades','No verificar la respuesta','Saltarse un paso','Error de dominio (ej: negativo bajo raíz)','Confundir MCM con MCD','Error en potencias/radicales'],
  Álgebra:['Error de signo','Factorización incorrecta','Despeje incorrecto','Error de dominio','Simplificación incorrecta','Error de cálculo','Confusión de fórmula','Aplicar regla de producto a suma','Error en sustitución','Olvidar caso negativo en valor absoluto'],
  Física:['Error de unidades','Error de signo en vectores','No identificar el sistema de referencia','Confundir masa y peso','Error en diagrama de fuerzas','Fórmula incorrecta','Error en conversión de unidades','No aplicar conservación de energía','Confundir velocidad y aceleración','Error en trigonometría del problema'],
  Geometría:['Error en identificar el teorema','Confundir ángulo inscrito y central','Error de cálculo de área','Propiedad de triángulos incorrecta','Error en semejanza de triángulos','No distinguir radio y diámetro','Error en polígonos regulares','Olvidar caso de ángulo obtuso','Error de Pitágoras','Confusión entre perímetro y área'],
  Trigonometría:['Identidad mal aplicada','Error de cuadrante','Confundir sen y cos','Error en conversión radián-grado','Olvido de valor absoluto','Error en Ley de senos/cosenos','Confundir arcsen con 1/sen','Error de signo en identidades','No simplificar al final','Error en ecuación trig (solución incompleta)'],
  Química:['Error en balanceo','Confundir mol con gramo','Error de estequiometría','Nomenclatura incorrecta','Error en configuración electrónica','Confundir enlace iónico y covalente','Error en cálculo de pH','No aplicar gas ideal correctamente','Error en ecuación de equilibrio','Confundir oxidación y reducción'],
  _global:['Leí mal el enunciado','Me confundí al operar','Me bloqueé demasiado tiempo','No revisé la respuesta','Copié mal el dato','Confundí el concepto clave','Error de concentración / distracción','No identificé el tipo de problema','Saltarme pasos intermedios','Calculadora / operación apresurada'],
  'Historia Universal':['Confundí fechas','Confundí personajes','Confundí lugares','Confundí causas y consecuencias','Confundí procesos históricos','No reconocí el contexto histórico','Confundí acontecimientos similares','Interpreté mal la fuente','No recordaba el dato','Descarté mal una alternativa'],
  'Historia del Perú':['Confundí fechas','Confundí personajes','Confundí lugares','Confundí causas y consecuencias','Confundí procesos históricos','No reconocí el contexto histórico','Confundí acontecimientos similares','Interpreté mal la fuente','No recordaba el dato','Descarté mal una alternativa'],
  Geografia:['Confundí ubicación','Confundí regiones','Confundí conceptos geográficos','Interpreté mal el mapa','Confundí causas y consecuencias','Confundí características de un territorio','Error con datos estadísticos','No reconocí el fenómeno geográfico','No recordaba el dato','Descarté mal una alternativa'],
   Filosofía:['Confundí autores','Confundí corrientes filosóficas','Confundí conceptos','Atribuí una idea al autor equivocado','Interpreté mal el argumento','Confundí tesis y argumento','No identifiqué la postura filosófica','No recordaba el concepto','Me fui por una interpretación intuitiva','Descarté mal una alternativa'],
  Literatura:['Confundí autor y obra','Confundí personajes','Confundí movimientos literarios','Confundí características del movimiento','Confundí género literario','No reconocí el recurso literario','Interpreté mal el fragmento','Confundí contexto y obra','No recordaba el dato','Descarté mal una alternativa'],
  Lenguaje:['Confundí la regla gramatical','Confundí categorías gramaticales','Error de sintaxis','Error de ortografía','Error de puntuación','Confundí significados','No identifiqué la función de la palabra','Interpreté mal el enunciado','Confundí conceptos lingüísticos','Descarté mal una alternativa'],
  'Raz. Verbal':['Interpreté mal el texto','No identifiqué la idea principal','Confundí una inferencia','Confundí el significado de una palabra','Relación lógica incorrecta','Analogía incorrecta','Ordenamiento incorrecto','Leí demasiado rápido','Me dejé llevar por una alternativa plausible','Descarté mal una alternativa'],
  'Raz. Matemático':['No identifiqué el patrón','Planteamiento incorrecto','Error de lógica','Error de cálculo','Interpreté mal el problema','No identifiqué la estrategia','Me faltó un caso','Asumí algo que no estaba dado','Me bloqueé demasiado tiempo','Descarté mal una alternativa'],
  Ingles:['Vocabulario desconocido','Confundí tiempos verbales','Confundí estructura gramatical','Interpreté mal el texto','Confundí significado por contexto','Error de preposición','Error con phrasal verb','No reconocí la referencia','Leí demasiado rápido','Descarté mal una alternativa']
};

function getPresetsForCourse(course){
  return(ERROR_PRESETS[course]||[]).concat(ERROR_PRESETS._global);
}

// Render preset chips inside the global error panel
function renderGlobalErrPresets(){
  const sel=document.getElementById('errPresetCourse');
  const wrap=document.getElementById('errPresetChips');
  if(!sel||!wrap)return;
  const course=sel.value;
  const presets=getPresetsForCourse(course);
  wrap.innerHTML=presets.map(p=>
    `<span class="epreset-chip" onclick="addEFromPreset('${course}','${p.replace(/'/g,"\\'")}',this)">${p}</span>`
  ).join('');
}

function addEFromPreset(course,preset,el){
  if(!S.errors)S.errors=[];
  // Format: if course is not _global, use [course] prefix
  const formatted=course && course!=='_global'?'['+course+'] '+preset:preset;
  const idx=S.errors.indexOf(formatted);
  if(idx>=0){if(!S.errcnt)S.errcnt={};S.errcnt[idx]=(S.errcnt[idx]||1)+1;}
  else{S.errors.unshift(formatted);}
  const wk2=wkey();if(!S.ws)S.ws={};S.ws[wk2]=S.ws[wk2]||{h:0,caps:0,errors:0};
  S.ws[wk2].errors=(S.ws[wk2].errors||0)+1;
  save();renderE();renderWS();
  maybeOfferFlashcard(formatted);
  // flash chip
  if(el){el.classList.add('selected');setTimeout(()=>el.classList.remove('selected'),500);}
}

// Render preset chips inside a topic card
function renderCapErrPresets(id,course){
  const wrap=document.getElementById('cap-epreset-'+id);
  if(!wrap)return;
  const presets=getPresetsForCourse(course);
  wrap.innerHTML=presets.slice(0,8).map(p=>
    `<span class="cap-epreset-chip" onclick="event.stopPropagation();saveCapErrorPreset('${id}','${p.replace(/'/g,"\\'")}')">${p}</span>`
  ).join('')
  +`<span class="cap-epreset-chip" style="color:var(--muted);border-color:var(--border)" onclick="event.stopPropagation();toggleCapErrInput('${id}')">+ personalizado</span>`;
}
// ═══ ERROR RECURRENTE → OFERTA DE FLASHCARD ═══
function countErrorOccurrences(errorText){
  let total = 0;
  (S.errors || []).forEach((e, i) => {
    if (e === errorText) total += (S.errcnt || {})[i] || 1;
  });
  return total;
}

function maybeOfferFlashcard(errorText){
  if (!errorText) return;
  const count = countErrorOccurrences(errorText);
  if (count < 3) return;
  if (!S.errorFlashOffered) S.errorFlashOffered = {};
  if (S.errorFlashOffered[errorText]) return;
  S.errorFlashOffered[errorText] = true;
  save();
  showFlashcardOfferModal(errorText, count);
}

function showFlashcardOfferModal(errorText, count){
  document.getElementById('_flashOfferModal')?.remove();
  const m = document.createElement('div');
  m.id = '_flashOfferModal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:3500;display:flex;align-items:center;justify-content:center;padding:1rem';
  m.onclick = (e) => { if (e.target === m) closeFlashOfferModal(); };
  const safe = errorText.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');
  m.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.4rem 1.5rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.6)">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.9rem;border-bottom:1px solid var(--border);padding-bottom:.7rem">
        <span style="font-size:1.1rem">🃏</span>
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;color:var(--accent);flex:1">Error recurrente detectado</div>
        <button onclick="closeFlashOfferModal()" style="background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;border-radius:4px;font-size:.72rem;padding:.1rem .35rem;line-height:1">✕</button>
      </div>
      <div style="font-size:.72rem;color:var(--muted);line-height:1.5;margin-bottom:.6rem">
        Este error aparece <strong style="color:var(--accent2)">${count} veces</strong> en tu registro. Ya no es ruido, es un patrón.
      </div>
      <div style="font-size:.74rem;color:var(--text);background:#1a0a0f;border-left:3px solid var(--accent2);padding:.55rem .7rem;border-radius:4px;margin-bottom:.8rem;line-height:1.5">
        ${errorText}
      </div>
      <div style="font-size:.72rem;color:var(--muted);line-height:1.5;margin-bottom:1rem">
        ¿Convertirlo en flashcard? Vas a poder editar la pregunta y escribir la respuesta. La tarjeta entra al sistema que ya usas.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
        <button onclick="closeFlashOfferModal()" style="padding:.55rem;background:transparent;border:1px solid var(--border);color:var(--muted);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.64rem">Dejar por ahora</button>
        <button onclick="acceptFlashcardOffer('${safe}')" style="padding:.55rem;background:var(--accent3);color:#000;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.64rem;font-weight:700">Crear flashcard</button>
      </div>
    </div>`;
  document.body.appendChild(m);
}

function closeFlashOfferModal(){
  document.getElementById('_flashOfferModal')?.remove();
}

function acceptFlashcardOffer(errorText){
  closeFlashOfferModal();
  let course = '';
  const matchId = errorText.match(/^\[([a-z]+\d+)\]/);
  const matchCourse = errorText.match(/^\[([A-Za-záéíóúÁÉÍÓÚñÑ.\s]+)\]/);
  if (matchId) {
    const info = getTopic(matchId[1]);
    if (info && info.course) course = info.course;
  } else if (matchCourse) {
    const c = matchCourse[1].trim();
    if (TOPICS[c]) course = c;
  }
  const clean = errorText.replace(/^\[[^\]]+\]\s*/, '').trim();
  showView('flashcards', document.querySelector('.sb-btn[onclick*="flashcards"]'));
  setTimeout(() => {
    const fcCourse = document.getElementById('fcCourse');
    const fcQuestion = document.getElementById('fcQuestion');
    const fcAnswer = document.getElementById('fcAnswer');
    if (fcCourse && course) {
      fcCourse.value = course;
      if (typeof updateFCTopics === 'function') updateFCTopics();
    }
    if (fcQuestion) fcQuestion.value = clean;
    if (fcAnswer) {
      fcAnswer.focus();
      fcAnswer.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }, 180);
}
function saveCapErrorPreset(id,preset){
  saveCapError(id,preset);
  // brief flash of the cap error area
  const el=document.getElementById('caperr-'+id);
  if(el){el.style.transition='background .25s';el.style.background='#2a0808';setTimeout(()=>el.style.background='',400);}
}

function toggleCapErrInput(id){
  const wrap=document.getElementById('tierradd-'+id);
  if(wrap){wrap.style.display=wrap.style.display==='none'?'flex':'none';}
}

function addE(){
  const inp=document.getElementById('einput'),v=inp.value.trim();if(!v)return;
  const course=document.getElementById('errCourseSelect').value;
  if(!S.errors)S.errors=[];
  // Format: if course selected, use [course] prefix
  const formatted=course?'['+course+'] '+v:v;
  // check duplicate
  const idx=S.errors.indexOf(formatted);
  if(idx>=0){if(!S.errcnt)S.errcnt={};S.errcnt[idx]=(S.errcnt[idx]||1)+1;}
  else{S.errors.unshift(formatted);}
  const wk2=wkey();if(!S.ws)S.ws={};S.ws[wk2]=S.ws[wk2]||{h:0,caps:0,errors:0};
  S.ws[wk2].errors=(S.ws[wk2].errors||0)+1;
  inp.value='';document.getElementById('errCourseSelect').value='';save();renderE();renderWS();
  maybeOfferFlashcard(formatted);
}
function delE(i){
  // Also remove from errcnt if exists
  if(S.errcnt){
    delete S.errcnt[i];
    // Rebuild errcnt with shifted indices
    const newErrcnt={};
    Object.entries(S.errcnt).forEach(([k,v])=>{
      const idx=parseInt(k);
      if(idx>i)newErrcnt[idx-1]=v;
      else if(idx<i)newErrcnt[idx]=v;
    });
    S.errcnt=newErrcnt;
  }
  S.errors.splice(i,1);
  save();
  renderE();
}
function sortErrors(){
  if(!S.errcnt||!S.errors)return;
  const pairs=S.errors.map((e,i)=>({e,cnt:S.errcnt[i]||1}));
  pairs.sort((a,b)=>b.cnt-a.cnt);
  S.errors=pairs.map(p=>p.e);
  S.errcnt={};pairs.forEach((p,i)=>S.errcnt[i]=p.cnt);
  save();renderE();
}

// ── HEATMAP ──
// ── HEATMAP ──
function getDaySegments(k){
  const segs=(S.dailySegments||{})[k]||{};
  const arr=[];
  for(const [course,data] of Object.entries(segs)){
    const total=(data.teoria||0)+(data.ejercicios||0)+(data.repaso||0);
    if(total>0)arr.push({course,total,rgb:COURSE_RGB[course]||[120,120,120]});
  }
  arr.sort((a,b)=>b.total-a.total);
  return arr;
}

function renderHeatmap(){
  const days=['L','M','X','J','V','S','D'];
  const hdr=document.getElementById('hmHeader');
  const grid=document.getElementById('heatmapGrid');
  if(!hdr||!grid)return;
  hdr.innerHTML=days.map(d=>'<div class="hm-lbl">'+d+'</div>').join('');
  const cells=[];
  const allDays=[];
  for(let i=0;i<56;i++){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-55+i);allDays.push(d);}
  const firstDow=(allDays[0].getDay()+6)%7;
  // Relleno inicial para alinear el primer día al día de la semana correcto
  for(let p=0;p<firstDow;p++){
    cells.push('<div class="hm-day" style="background:transparent;pointer-events:none;border:none"></div>');
  }
  for(let i=0;i<56;i++){
    const d=allDays[i];
    const k=localKey(d);
    const efSecs=(S.h||{})[k]||0;
    const brkSecs=(S.hBreak||{})[k]||0;

    if(efSecs>0){
      const segs=getDaySegments(k);
      if(segs.length){
        const totalAll=segs.reduce((a,s)=>a+s.total,0);
        let inner='';
        segs.forEach(seg=>{
          const flex=seg.total/totalAll;
          const col='rgb('+seg.rgb[0]+','+seg.rgb[1]+','+seg.rgb[2]+')';
          inner+='<div class="hm-seg" style="flex:'+flex+';background:'+col+'"></div>';
        });
        const breakdown=segs.map(s=>s.course+': '+fmt(s.total)).join(' · ');
        const brkStr=brkSecs>0?' · descanso '+fmt(brkSecs):'';
        const tipFull=k+' — total: '+fmt(totalAll)+brkStr+' · '+breakdown;
        cells.push('<div class="hm-day" title="'+tipFull+'" style="background:#fff">'+inner+'</div>');
        continue;
      }
    }
    // Día sin estudio
    const brkStr=brkSecs>0?' · descanso '+fmt(brkSecs):'';
        cells.push('<div class="hm-day" title="'+k+(STUDY_DAYS.includes(d.getDay())?' — sin estudio':' — descanso')+brkStr+'"'+(STUDY_DAYS.includes(d.getDay())?'':' style="opacity:.2"')+'></div>');
  }
  grid.innerHTML=cells.join('');
  renderHeatmapLegend();
}

function renderHeatmapLegend(){
  let el=document.getElementById('hmLegend');
  if(!el){
    el=document.createElement('div');
    el.id='hmLegend';
    el.style.cssText='display:flex;flex-wrap:wrap;gap:.3rem .6rem;margin-top:.5rem;font-size:.66rem;color:var(--muted)';
    document.getElementById('heatmapGrid').after(el);
  }
  // Cursos con horas registradas (o los 6 principales si no hay datos aún)
  const withHours=Object.keys(COURSE_RGB).filter(c=>(S.h||{})['c'+c]>0);
  const courses=withHours.length?withHours:['Aritmética','Álgebra','Física','Geometría','Trigonometría','Química'];
  el.innerHTML=courses.map(c=>{
    const rgb=COURSE_RGB[c]||[120,120,120];
    const col='rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
    return '<span><span style="display:inline-block;width:8px;height:8px;background:'+col+';border-radius:2px;margin-right:2px;vertical-align:middle"></span>'+c+'</span>';
  }).join('');
  el.innerHTML+='<span style="margin-left:.5rem;opacity:.6">· barra = proporción de horas por curso · separador = blanco</span>';
}

// ── PREDICCION ──
function renderPrediction(){
  const el=document.getElementById('predBox');
  if(!el)return;
  const td=today();
  const todayDate=new Date(td+'T12:00:00');

  // Caps completados por día
  const doneByDay={};
  for(const[id,data]of Object.entries(S.t||{})){
    if(data.done&&data.completedAt){
      const d=localKey(new Date(data.completedAt));
      doneByDay[d]=(doneByDay[d]||0)+1;
    }
  }

  // Ritmo real: promedio caps/día últimos 7 días
  let capsLast7=0;
  for(let i=0;i<7;i++){
    const d=new Date(todayDate);d.setDate(d.getDate()-i);
    capsLast7+=(doneByDay[localKey(d)]||0);
  }
  const actualRate=capsLast7/7;

  const courses=Object.keys(TOPICS);
  const rows=courses.map(name=>{
    const ids=Object.keys(TOPICS[name]||{});
    const total=ids.length;
    const done=ids.filter(id=>(S.t||{})[id]?.done).length;
    const remaining=total-done;

    // Encontrar la ventana real del curso dentro de WSCHED
    let firstWeek=null,lastWeek=null;
    for(const w of WSCHED){
      const has=w.topics.some(id=>TOPICS[name]?.[id]);
      if(has){
        if(!firstWeek)firstWeek=w;
        lastWeek=w;
      }
    }
    if(!firstWeek){
      return{name,done,total,remaining,pred:'sin programar',cls:'pred-neutral'};
    }

    const planStart=firstWeek.s;
    const planEnd=lastWeek.e;
    const planStartDate=new Date(planStart+'T12:00:00');
    const planEndDate=new Date(planEnd+'T12:00:00');
    const totalDays=Math.max(1,Math.round((planEndDate-planStartDate)/86400000)+1);
    const plannedRate=total/totalDays;

    let cls='pred-neutral',pred='—';

    if(remaining===0){
      cls='pred-ok';
      pred='✓ completado';
    }else if(todayDate<planStartDate){
      const daysUntil=Math.round((planStartDate-todayDate)/86400000);
      pred='empieza en '+daysUntil+'d';
    }else{
      const daysElapsed=Math.round((todayDate-planStartDate)/86400000)+1;
      const expectedDone=Math.min(total,Math.round(plannedRate*daysElapsed));
      const ahead=done-expectedDone;

      const rate=actualRate>0?actualRate:plannedRate;
      const daysNeeded=Math.ceil(remaining/rate);
      const finishDate=new Date(todayDate);
      finishDate.setDate(finishDate.getDate()+daysNeeded);
      const finish=localKey(finishDate);

      const pace=ahead>0?' (+'+ahead+')':ahead<0?' ('+ahead+')':'';
      const daysLate=Math.round((finishDate-planEndDate)/86400000);

      if(finish<=planEnd){cls='pred-ok';pred='✓ '+finish+pace;}
      else if(daysLate<=3){cls='pred-close';pred='~ '+finish+pace;}
      else{cls='pred-warn';pred='⚠ '+finish+pace;}
    }
    return{name,done,total,remaining,pred,cls};
  }).filter(r=>r.total>0);

  const head='<div class="pred-row" style="color:var(--muted);font-size:.68rem;border-bottom:1px solid var(--border);font-weight:600">'
    +'<span>Curso</span><span>Caps</span><span>Predicción</span></div>';
  const body=rows.map(r=>{
    return'<div class="pred-row">'
      +'<span>'+r.name+'</span>'
      +'<span style="color:var(--muted)">'+r.done+'/'+r.total+'</span>'
      +'<span class="'+r.cls+'">'+r.pred+'</span>'
      +'</div>';
  }).join('');

  el.innerHTML=head+body;
}


 

// ── WEEKLY SUMMARY ──
function renderWS(){
  if(!S.ws)return;
  const entries=Object.entries(S.ws).sort((a,b)=>a[0]>b[0]?1:-1);
  if(!entries.length){document.getElementById('wsgrid').innerHTML='<div style="font-size:.72rem;color:var(--muted)">Sin datos aún.</div>';return;}
  document.getElementById('wsgrid').innerHTML=entries.map(([wk2,data])=>{
    const dp=wk2.split('-');const d=new Date(Number(dp[0]),Number(dp[1])-1,Number(dp[2]));const lbl=(d.getDate()+'/'+(d.getMonth()+1));
    return'<div class="ws-item"><div class="ws-wk">Sem '+lbl+'</div><div class="ws-stats">'+fmt(data.h||0)+' · '+(data.caps||0)+' caps · '+(data.errors||0)+' err</div></div>';
  }).join('');
}

// ── SIMULACROS ──
const SIM_LABELS=['Mate S1','Mate S2','Mate S3','Fís S1','Fís S2','Quím S1','Quím S2'];
function renderSim(){
  if(!S.sim)S.sim={};
  document.getElementById('simscores').innerHTML=SIM_LABELS.map((lbl,i)=>{
    const grp=lbl.split(' ')[0];
    const prev=i>0&&SIM_LABELS[i-1].split(' ')[0]===grp?S.sim[i-1]:null;
    const val=S.sim[i]||'';
    let delta='';
    if(prev&&val){const d=parseInt(val)-parseInt(prev);delta=d>0?'<span class="sim-delta up">+'+d+'</span>':d<0?'<span class="sim-delta dn">'+d+'</span>':'<span class="sim-delta eq">=</span>';}
    return'<div class="sim-row"><span class="sim-label">'+lbl+'</span><input class="sim-input" type="number" min="0" max="100" value="'+val+'" placeholder="—" onchange="saveSim('+i+',this.value)" onclick="event.stopPropagation()">/100'+delta+'</div>';
  }).join('');
}
function saveSim(i,v){if(!S.sim)S.sim={};S.sim[i]=v;save();renderSim();}

// ── SEARCH ──
function doSearch(q){
  q=q.trim().toLowerCase();
  document.querySelectorAll('.ti.search-match').forEach(el=>el.classList.remove('search-match'));
  document.querySelectorAll('.week.highlight-search').forEach(el=>el.classList.remove('highlight-search'));
  const sr=document.getElementById('searchresults');
  if(!q){sr.classList.remove('on');sr.innerHTML='';return;}
  const matches=[];
  document.querySelectorAll('.ti[data-id]').forEach(el=>{
    const name=(el.dataset.name||'').toLowerCase();
    const course=(el.dataset.course||'').toLowerCase();
    // also search lum badge text
    const lum=el.querySelector('.lum')?.textContent.toLowerCase()||'';
    if(name.includes(q)||course.includes(q)||lum.includes(q)){
      matches.push(el);el.classList.add('search-match');
      const w=el.closest('.week');if(w)w.classList.add('highlight-search','ex');
    }
  });
  const colors={Aritmética:'var(--ca)',Álgebra:'var(--calg)',Física:'var(--cf)',Geometría:'var(--cg)',Trigonometría:'var(--ct)',Química:'var(--cq)',Simulacros:'#ffdd6a'};
  if(!matches.length){sr.classList.add('on');sr.innerHTML='<div style="color:var(--muted)">Sin resultados para "'+q+'"</div>';return;}
  sr.classList.add('on');
  sr.innerHTML='<div style="color:var(--muted);margin-bottom:.35rem">'+matches.length+' resultado(s):</div>'+
    matches.slice(0,8).map(el=>{
      const c=el.dataset.course,col=colors[c]||'#888';
      return'<div class="sr-item" onclick="scrollToTopic(\''+el.dataset.id+'\')"><span class="sr-course" style="color:'+col+';border:1px solid '+col+'">'+c+'</span><span>'+el.dataset.name+'</span></div>';
    }).join('');
}
function scrollToTopic(id){
  showView('plan',document.querySelector('.sb-btn'));
  setTimeout(()=>{const el=document.querySelector('[data-id="'+id+'"]');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},100);
}
function clearSearch(){document.getElementById('searchinput').value='';doSearch('');}

// ── FOCUS ──
let fT='',fC='';

function enterF(){
  document.getElementById('ftopic').textContent=fT||'Selecciona un tema con ⊞';
  document.getElementById('fcourse').textContent=fC||'—';
  renderE();document.getElementById('fov').classList.add('on');
}
function exitF(){document.getElementById('fov').classList.remove('on');}

// ── EXAM MODE ──
let emTimerInt=null,emSec=300,emRunning=false;
function enterExamMode(){
  const errs=S.errors||[];
  if(!errs.length){showToast('Añade errores al registro primero.');return;}
  emSec=300;emRunning=false;
  document.getElementById('examOv').classList.add('on');
  emNext();
}
function emNext(){
  const errs=S.errors||[];if(!errs.length)return;
  const idx=Math.floor(Math.random()*errs.length);
  document.getElementById('emQ').textContent=errs[idx];
  emSec=300;upEmTimer();
}
function emToggleTimer(){
  if(emRunning){clearInterval(emTimerInt);emRunning=false;}
  else{
    emRunning=true;
    const emStart=Date.now();const emSecAtStart=emSec;
    emTimerInt=setInterval(()=>{
      const elapsed=Math.floor((Date.now()-emStart)/1000);
      emSec=Math.max(0,emSecAtStart-elapsed);
      upEmTimer();
      if(emSec<=0){clearInterval(emTimerInt);emRunning=false;}
    },1000);
  }
}
function upEmTimer(){
  const m=String(Math.floor(emSec/60)).padStart(2,'0'),s=String(emSec%60).padStart(2,'0');
  document.getElementById('emTimer').textContent=m+':'+s;
}
function exitExamMode(){clearInterval(emTimerInt);emRunning=false;document.getElementById('examOv').classList.remove('on');}

// ── BANCO ──

// File System Access API - Root directory handle
let uniDirHandle=null;
// IndexedDB for persisting directory handle
const DB_NAME='UniPlanDB';
const DB_VERSION=4;
const STORE_NAME='directoryHandles';
const IMG_STORE='images';
const FC_STORE='flashcards';
async function openDB(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>resolve(request.result);
    request.onupgradeneeded=(e)=>{
      const db=e.target.result;
      if(!db.objectStoreNames.contains(STORE_NAME)){
        db.createObjectStore(STORE_NAME);
      }
      if(!db.objectStoreNames.contains(IMG_STORE)){
        db.createObjectStore(IMG_STORE);
      }
      if(!db.objectStoreNames.contains(FC_STORE)){
        db.createObjectStore(FC_STORE);
      }
    };
  });
}
// Save image blob to IndexedDB — persists across reloads
async function saveImageToDB(file){
  try{
    // Read arrayBuffer BEFORE opening transaction (transactions auto-close during await)
    const buffer=await file.arrayBuffer();
    const blob=new Blob([buffer],{type:file.type});
    const db=await openDB();
    const key='img_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const tx=db.transaction(IMG_STORE,'readwrite');
    const store=tx.objectStore(IMG_STORE);
    await new Promise((res,rej)=>{const r=store.put(blob,key);r.onsuccess=res;r.onerror=()=>rej(r.error);});
    await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});
    db.close();
    return 'idb:'+key;
  }catch(err){
    console.error('Error saving image to IndexedDB:',err);
    return null;
  }
}
// Load image blob from IndexedDB
async function loadImageFromDB(key){
  try{
    const db=await openDB();
    const tx=db.transaction(IMG_STORE,'readonly');
    const store=tx.objectStore(IMG_STORE);
    const blob=await new Promise((res,rej)=>{const r=store.get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
    db.close();
    if(!blob)return null;
    return URL.createObjectURL(blob);
  }catch(err){
    console.error('Error loading image from IndexedDB:',err);
    return null;
  }
}
async function saveDirHandle(handle){
  try{
    const db=await openDB();
    const tx=db.transaction(STORE_NAME,'readwrite');
    const store=tx.objectStore(STORE_NAME);
    await store.put(handle,'uniDirHandle');
    await new Promise((resolve,reject)=>{
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }catch(err){
    console.error('Error saving dir handle:',err);
  }
}
async function loadDirHandle(){
  try{
    const db=await openDB();
    const tx=db.transaction(STORE_NAME,'readonly');
    const store=tx.objectStore(STORE_NAME);
    const handle=await new Promise((resolve,reject)=>{
      const request=store.get('uniDirHandle');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    db.close();
    return handle;
  }catch(err){
    console.error('Error loading dir handle:',err);
    return null;
  }
}
// Select UNI folder
async function selectUniFolder(){
  try{
    uniDirHandle=await window.showDirectoryPicker();
    await saveDirHandle(uniDirHandle);
    document.getElementById('uniFolderStatus').textContent='✓ Seleccionada';
    document.getElementById('uniFolderStatus').style.color='var(--accent3)';
    showToast('Carpeta UNI seleccionada correctamente.');
    save();
  }catch(err){
    if(err.name!=='AbortError'){
      showToast('Error al seleccionar carpeta: '+err.message);
    }
  }
}
// Get or create directory path
async function getOrCreateDir(handle,path){
  let current=handle;
  const parts=path.split('/').filter(p=>p);
  for(const part of parts){
    current=await current.getDirectoryHandle(part,{create:true});
  }
  return current;
}
// Save image — uses IndexedDB, persists across reloads
async function saveImageToFile(file,course,tema){
  return await saveImageToDB(file);
}
// Load image — idb: paths from IndexedDB, old paths from filesystem (fallback)
async function loadImageFromPath(path){
  if(!path)return null;
  if(path.startsWith('idb:')){
    return await loadImageFromDB(path.slice(4));
  }
  if(!uniDirHandle)return null;
  try{
    const parts=path.split('/').filter(p=>p);
    let current=uniDirHandle;
    for(let i=0;i<parts.length-1;i++){
      current=await current.getDirectoryHandle(parts[i]);
    }
    const fileHandle=await current.getFileHandle(parts[parts.length-1]);
    const file=await fileHandle.getFile();
    return URL.createObjectURL(file);
  }catch(err){
    console.error('Error loading image from filesystem:',err);
    return null;
  }
}
// Preview image on file selection
document.getElementById('bankImage')?.addEventListener('change',function(e){
  const file=e.target.files[0];
  const preview=document.getElementById('bankImagePreview');
  if(!file||!preview)return;
  const reader=new FileReader();
  reader.onload=function(ev){
    preview.innerHTML='<img src="'+ev.target.result+'" style="max-width:100%;max-height:150px;border-radius:4px">';
    preview.style.display='block';
  };
  reader.readAsDataURL(file);
});
async function addBank(){
  const course=document.getElementById('bankCourse').value;
  const tema=document.getElementById('bankTema').value;
  const prob=document.getElementById('bankProblem').value.trim();
  const sol=document.getElementById('bankSolution').value.trim();
  const imageInput=document.getElementById('bankImage');
  const preview=document.getElementById('bankImagePreview');
  if(!prob&&!imageInput.files.length)return;
  if(!S.bank)S.bank=[];
  const entry={course,tema:tema||'',prob:prob||'',sol:sol||'',date:today()};
  // Handle image with File System API
  if(imageInput.files.length>0){
    const file=imageInput.files[0];
    const imagePath=await saveImageToFile(file,course,tema);
    if(imagePath){
      entry.image=imagePath;
      S.bank.unshift(entry);
      document.getElementById('bankProblem').value='';
      document.getElementById('bankSolution').value='';
      document.getElementById('bankTema').value='';
      imageInput.value='';
      preview.innerHTML='';
      preview.style.display='none';
      save();renderBank();updateBankFilterTemas();updateExamGenTemas();
    }
  }else{
    S.bank.unshift(entry);
    document.getElementById('bankProblem').value='';
    document.getElementById('bankSolution').value='';
    document.getElementById('bankTema').value='';
    save();renderBank();updateBankFilterTemas();updateExamGenTemas();
  }
}
function bankTemasForCourse(course){
  if(!S.bank)return[];
  const temas=new Set();
  S.bank.forEach(b=>{if((!course||b.course===course)&&b.tema)temas.add(b.tema);});
  return[...temas].sort();
}
function updateBankTopics(){
  const course=document.getElementById('bankCourse')?.value||'';
  const sel=document.getElementById('bankTema');if(!sel)return;
  const temas=[];
  if(course && TOPICS[course]){
    Object.entries(TOPICS[course]).forEach(([id,name])=>{
      temas.push({id,name});
    });
  }
  const cur=sel.value;
  sel.innerHTML='<option value="" disabled selected hidden>tema</option>'+temas.map(t=>`<option value="${t.name}"${t.name===cur?' selected':''}>${t.name}</option>`).join('');
}
function updateBankFilterTemas(){
  const course=document.getElementById('bankFilterCourse')?.value||'';
  const sel=document.getElementById('bankFilterTema');if(!sel)return;
  const temas=bankTemasForCourse(course);
  const cur=sel.value;
  sel.innerHTML='<option value="">— Todos los temas —</option>'+temas.map(t=>'<option'+(t===cur?' selected':'')+'>'+t+'</option>').join('');
}
function updateExamGenTemas(){
  const course=document.getElementById('examGenCourse')?.value||'';
  const sel=document.getElementById('examGenTema');if(!sel)return;
  const temas=bankTemasForCourse(course);
  sel.innerHTML='<option value="">— tema (todos) —</option>'+temas.map(t=>'<option>'+t+'</option>').join('');
}
async function renderBank(){
  if(!S.bank)S.bank=[];
  updateBankFilterTemas();
  const fCourse=document.getElementById('bankFilterCourse')?.value||'';
  const fTema=document.getElementById('bankFilterTema')?.value||'';
  let items=S.bank.filter((b,_i)=>(!fCourse||b.course===fCourse)&&(!fTema||b.tema===fTema));
  document.getElementById('bankCount').textContent=S.bank.length;
  const el=document.getElementById('bankList');
  if(!items.length){el.innerHTML='<div style="font-size:.6rem;color:var(--muted);padding:.3rem">Sin problemas guardados'+((fCourse||fTema)?' para este filtro':'')+'. </div>';return;}
  // Group by course > tema
  const grouped={};
  items.forEach((item,_)=>{
    const c=item.course||'Sin curso';const t=item.tema||'Sin tema';
    if(!grouped[c])grouped[c]={};
    if(!grouped[c][t])grouped[c][t]=[];
    grouped[c][t].push(item);
  });
  let html='';
  for(const c of Object.keys(grouped).sort()){
    html+='<div style="font-size:.70rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:.55rem 0 .2rem;padding:.1rem 0;border-bottom:1px solid var(--border)">'+c+'</div>';
    for(const t of Object.keys(grouped[c]).sort()){
      html+='<div style="font-size:.68rem;color:var(--accent4);margin:.3rem 0 .15rem;padding-left:.2rem">▸ '+t+' ('+grouped[c][t].length+')</div>';
      for(const item of grouped[c][t]){
        const i=S.bank.indexOf(item);
        let imageHtml='';
        if(item.image){
          const imageUrl=await loadImageFromPath(item.image);
          if(imageUrl){
            imageHtml='<div style="margin:.2rem 0"><img src="'+imageUrl+'" style="max-width:100%;max-height:120px;border-radius:4px;border:1px solid var(--border);cursor:pointer" onclick="this.style.maxHeight=this.style.maxHeight===&quot;120px&quot;?&quot;none&quot;:&quot;120px&quot;"></div>';
          }else{
            imageHtml='<div style="margin:.2rem 0;font-size:.68rem;color:var(--accent2)">⚠ Imagen no encontrada (selecciona carpeta UNI)</div>';
          }
        }
        html+='<div class="bank-item"><div class="bank-item-hdr"><span class="bank-course-tag">'+item.date+'</span><span class="bank-del" onclick="delBank('+i+')">✕</span></div>'
          +imageHtml
          +(item.prob?'<div class="bank-content">'+item.prob+'</div>':'')
          +(item.sol?'<div style="color:var(--accent3);font-size:.70rem;margin-top:.2rem">→ '+item.sol+'</div>':'')
          +'</div>';
      }
    }
  }
  el.innerHTML=html;
}
function delBank(i){S.bank.splice(i,1);save();renderBank();}
async function generateExam(){
  if(!S.bank||!S.bank.length){document.getElementById('examGenResult').innerHTML='<div style="font-size:.6rem;color:var(--muted);padding:.4rem">No hay problemas guardados.</div>';return;}
  const course=document.getElementById('examGenCourse').value;
  const tema=document.getElementById('examGenTema').value;
  const n=Math.max(1,Math.min(40,parseInt(document.getElementById('examGenN').value)||10));
  // Pool exacto (tema elegido)
  const exactPool=S.bank.filter(b=>(!course||b.course===course)&&(!tema||b.tema===tema));
  if(!exactPool.length){document.getElementById('examGenResult').innerHTML='<div style="font-size:.6rem;color:var(--muted);padding:.4rem">Sin problemas para ese filtro.</div>';return;}

  // ── Contexto variado: 70% tema exacto + 30% relacionados (prereqs/deps/soft) ──
  let pool=exactPool;
  let mixInfo=null;
  if(course&&tema){
    const topicId=findTopicIdByCourseAndName(course,tema);
    if(topicId){
      const relatedIds=new Set([
        ...getPrereqs(topicId),
        ...getDependents(topicId),
        ...((typeof SOFT_DEPS!=='undefined'&&SOFT_DEPS[topicId])||[])
      ]);
      if(relatedIds.size){
        const relatedNames=new Set();
        relatedIds.forEach(rid=>{
          const info=getTopic(rid);
          if(info&&info.name)relatedNames.add(info.name);
        });
        const relatedPool=S.bank.filter(b=>
          b.course===course&&relatedNames.has(b.tema)&&b.tema!==tema
        );
        if(relatedPool.length){
          const nMain=Math.max(1,Math.round(n*0.7));
          const nRel=n-nMain;
          const pickMain=[...exactPool].sort(()=>Math.random()-.5).slice(0,nMain);
          const pickRel=[...relatedPool].sort(()=>Math.random()-.5).slice(0,nRel);
          pool=[...pickMain,...pickRel].sort(()=>Math.random()-.5);
          if(pickRel.length){
            const relLabels=[...new Set(pickRel.map(p=>p.tema))].join(', ');
            mixInfo='🔀 '+pickMain.length+' de <strong>'+tema+'</strong> + '+pickRel.length+' de contexto ('+relLabels+')';
          }
        }
      }
    }
  }

  // shuffle
  const shuffled=[...pool].sort(()=>Math.random()-.5);
  const selected=shuffled.slice(0,Math.min(n,shuffled.length));
  // Store current exam in session state
  window.currentExam={questions:selected,answers:{}};
  let html='<div style="font-size:.70rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem">Simulacro — '+selected.length+' pregunta'+(selected.length>1?'s':'')+' · Marca tu respuesta para cada una</div>'
    +(mixInfo?'<div style="font-size:.68rem;color:var(--accent4);margin-bottom:.5rem;padding:.3rem .5rem;background:var(--card);border-left:2px solid var(--accent4);border-radius:3px">'+mixInfo+'</div>':'');
      for(let i=0;i<selected.length;i++){
    const item=selected[i];
    let imageHtml='';
    if(item.image){
      const imageUrl=await loadImageFromPath(item.image);
      if(imageUrl){
        imageHtml='<div style="margin:.2rem 0"><img src="'+imageUrl+'" style="max-width:100%;max-height:250px;border-radius:4px;border:1px solid var(--border)"></div>';
      }else{
        imageHtml='<div style="margin:.2rem 0;font-size:.68rem;color:var(--accent2)">⚠ Imagen no encontrada (selecciona carpeta UNI)</div>';
      }
    }
    html+='<div class="bank-item" style="margin-bottom:.6rem"><div class="bank-item-hdr"><span style="font-size:.68rem;color:var(--muted)">'+(i+1)+'. '+item.course+(item.tema?' · '+item.tema:'')+'</span></div>'
      +imageHtml
      +(item.prob?'<div class="bank-content">'+item.prob+'</div>':'')
      +'<div style="display:flex;gap:.4rem;margin-top:.3rem;flex-wrap:wrap">'
      +['A','B','C','D','E'].map(opt=>`<label style="font-size:.68rem;padding:.15rem .4rem;background:#0a0a0f;border:1px solid var(--border);cursor:pointer;user-select:none"><input type="radio" name="exam_q_${i}" value="${opt}" onchange="window.currentExam.answers[${i}]='${opt}'"> ${opt}</label>`).join('')
      +'</div></div>';
  }
  html+='<button onclick="finishExam()" style="margin-top:.5rem;width:100%;padding:.35rem;background:var(--accent);color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:.70rem">✓ Finalizar simulacro</button>';
  document.getElementById('examGenResult').innerHTML=html;
}
async function finishExam(){
  if(!window.currentExam)return;
  const exam=window.currentExam;
  const answered=Object.keys(exam.answers).length;
  const total=exam.questions.length;
  let html='<div style="font-size:.70rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem">Resultados — '+answered+'/'+total+' respondidas</div>';
  html+='<div style="font-size:.68rem;color:var(--muted);margin-bottom:.4rem">Revisa cada pregunta y marca si acertaste o fallaste:</div>';
  for(let i=0;i<exam.questions.length;i++){
    const item=exam.questions[i];
    const userAns=exam.answers[i]||'—';
    let imageHtml='';
    if(item.image){
      const imageUrl=await loadImageFromPath(item.image);
      if(imageUrl){
        imageHtml='<div style="margin:.2rem 0"><img src="'+imageUrl+'" style="max-width:100%;max-height:150px;border-radius:4px;border:1px solid var(--border)"></div>';
      }else{
        imageHtml='<div style="margin:.2rem 0;font-size:.68rem;color:var(--accent2)">⚠ Imagen no encontrada (selecciona carpeta UNI)</div>';
      }
    }
    html+='<div class="bank-item" style="margin-bottom:.4rem"><div class="bank-item-hdr"><span style="font-size:.68rem;color:var(--muted)">'+(i+1)+'. Tu respuesta: '+userAns+'</span></div>'
      +imageHtml
      +(item.prob?'<div class="bank-content">'+item.prob+'</div>':'')
      +'<div style="display:flex;gap:.4rem;margin-top:.3rem">'
      +`<label style="font-size:.68rem;padding:.12rem .35rem;background:#0a1a0f;border:1px solid var(--accent3);color:var(--accent3);cursor:pointer"><input type="radio" name="exam_correct_${i}" value="correct" onchange="window.currentExam.questions[${i}].correct=true"> ✓ Acerté</label>`
      +`<label style="font-size:.68rem;padding:.12rem .35rem;background:#1a0a0f;border:1px solid var(--accent2);color:var(--accent2);cursor:pointer"><input type="radio" name="exam_correct_${i}" value="incorrect" onchange="window.currentExam.questions[${i}].correct=false"> ✕ Fallé</label>`
      +'</div></div>';
  }
  html+='<button onclick="calculateExamScore()" style="margin-top:.5rem;width:100%;padding:.35rem;background:var(--accent);color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:.70rem">Calcular nota</button>';
  document.getElementById('examGenResult').innerHTML=html;
}
function calculateExamScore(){
  if(!window.currentExam)return;
  const exam=window.currentExam;
  let correct=0,incorrect=0,unmarked=0;
  exam.questions.forEach(q=>{
    if(q.correct===true)correct++;
    else if(q.correct===false)incorrect++;
    else unmarked++;
  });
  const total=exam.questions.length;
  const score=correct>0?Math.round(correct/total*100):0;
  let html='<div style="font-size:.70rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem">Nota final</div>';
  html+='<div style="font-size:2rem;font-weight:700;color:'+(score>=60?'var(--accent3)':'var(--accent2)')+'">'+score+'/100</div>';
  html+='<div style="display:flex;gap:1rem;margin-top:.4rem;font-size:.68rem">'
    +'<div style="color:var(--accent3)">✓ '+correct+' aciertos</div>'
    +'<div style="color:var(--accent2)">✕ '+incorrect+' fallos</div>'
    +'<div style="color:var(--muted)">? '+unmarked+' sin marcar</div>'
    +'</div>';
  html+='<button onclick="generateExam()" style="margin-top:.5rem;width:100%;padding:.35rem;background:var(--border);color:var(--text);border:none;border-radius:4px;cursor:pointer;font-size:.68rem">Nuevo simulacro</button>';
  document.getElementById('examGenResult').innerHTML=html;
}

// ── FLASHCARDS ──
function initFCCourses(){
  const selects=[
    document.getElementById('fcCourse'),
    document.getElementById('fcFilterCourse')
  ];
  selects.forEach(select=>{
    if(!select)return;
    // Usar las claves reales de TOPICS — así nunca se desincroniza
    Object.keys(TOPICS).forEach(name=>{
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
    });
  });
}

function updateFCTopics(){
  const course=document.getElementById('fcCourse').value;
  const select=document.getElementById('fcTopic');
  select.innerHTML='<option value="" disabled selected hidden>tema</option>';
  if(!course||!TOPICS[course])return;
  Object.entries(TOPICS[course]).forEach(([id,name])=>{
    const option=document.createElement('option');
    option.value=name;
    option.textContent=name;
    select.appendChild(option);
  });
} 

function updatePasteFCTopics(){
  const course = document.getElementById('pasteFCCourse').value;
  const sel = document.getElementById('pasteFCTopic');
  if(!sel) return;
  sel.innerHTML = '<option value="" disabled selected hidden>tema</option>';
  if(!course || !TOPICS[course]) return;
  Object.entries(TOPICS[course]).forEach(([id, name])=>{
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });
}

function updateFCFilterTopics(){
  const course=document.getElementById('fcFilterCourse').value;
  const select=document.getElementById('fcFilterTopic');
  select.innerHTML='<option value="">Todos los temas</option>';

  // Poblar selector de tipos — extrae el tipo del último segmento de etiquetas con ::
  const tipoSel=document.getElementById('fcFilterTipo');
  if(tipoSel){
    const tipos=new Set();
    (S.fc||[]).forEach(c=>{
      if(course && c.course!==course)return;
      (c.etiquetas||[]).forEach(e=>{
        if(e.includes('::')){
          const parts=e.split('::');
          const t=parts[parts.length-1].trim();
          if(t)tipos.add(t);
        }
      });
    });
    tipoSel.innerHTML='<option value="">Todos los tipos</option>'+
      [...tipos].sort().map(t=>'<option value="'+t.replace(/"/g,'&quot;')+'">'+t+'</option>').join('');
  }

  _fcQueue=null;
  if(!course){renderFC();return;}
  if(TOPICS[course]){
    Object.entries(TOPICS[course]).forEach(([id,name])=>{
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
    });
  }
  renderFC();
}

// ═══ IMPORTAR CSV/TSV DE ANKI ═══
function parseCSV(text){
  const firstLine = text.split('\n')[0];
  const tabs = (firstLine.match(/\t/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const delim = tabs > commas ? '\t' : ',';
  const rows = [];
  let current = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i+1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === delim && !inQuotes) {
      current.push(field); field = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && text[i+1] === '\n') i++;
      current.push(field);
      if (current.some(x => x.length)) rows.push(current);
      current = []; field = '';
    } else {
      field += c;
    }
  }
  if (field || current.length) {
    current.push(field);
    if (current.some(x => x.length)) rows.push(current);
  }
  return rows;
}

function resolveCourseFromDeck(deckRaw){
  if (!deckRaw) return '';
  const deck = deckRaw.split('::')[0].trim();
  if (TOPICS[deck]) return deck;
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g,'');
  const target = normalize(deck);
  for (const name of Object.keys(TOPICS)) {
    if (normalize(name) === target) return name;
  }
  const aliases = {
    'rm':'Raz. Matemático','rv':'Raz. Verbal',
    'matematica':'Aritmética','matematicas':'Aritmética',
    'historia':'Historia Universal','historiaperu':'Historia del Perú',
    'filosofia':'Filosofía','fisica':'Física','algebra':'Álgebra',
    'quimica':'Química','geometria':'Geometría','trigonometria':'Trigonometría',
    'literatura':'Literatura','lenguaje':'Lenguaje','ingles':'Inglés',
    'geografia':'Geografía'
  };
  if (aliases[target]) return aliases[target];
  return '';
}

function resolveTopicFromTag(tagLevel1, course){
  if (!tagLevel1 || !course || !TOPICS[course]) return tagLevel1 || 'Importadas';
  const m = tagLevel1.match(/^Tema\s*(\d+)$/i);
  if (!m) return tagLevel1;
  const n = parseInt(m[1], 10);
  const courseTopics = Object.keys(TOPICS[course]);
  if (n < 1 || n > courseTopics.length) return tagLevel1;
  const topicId = courseTopics[n - 1];
  return TOPICS[course][topicId];
}

function importFCFile(file){
  if (!file) return;
  const status = document.getElementById('fcImportStatus');
  const fallbackCourse = document.getElementById('fcImportCourse').value;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const rows = parseCSV(e.target.result);
      if (rows.length < 2) {
        if (status) status.innerHTML = '<span style="color:var(--accent2)">⚠ El archivo no tiene filas suficientes.</span>';
        return;
      }
      const header = rows[0].map(h => h.toLowerCase().trim());
      const idxFront = header.findIndex(h => ['anverso','front','pregunta','question','q'].includes(h));
      const idxBack  = header.findIndex(h => ['reverso','back','respuesta','answer','a'].includes(h));
      const idxTags  = header.findIndex(h => ['etiquetas','tags','tag','tema','topic'].includes(h));
      const idxDeck  = header.findIndex(h => ['deck','mazo','curso','course'].includes(h));
      const hasHeader = idxFront >= 0 && idxBack >= 0;
      const fFront = hasHeader ? idxFront : 0;
      const fBack  = hasHeader ? idxBack  : 1;
      const fTags  = hasHeader && idxTags >= 0 ? idxTags : 2;
      const fDeck  = hasHeader && idxDeck >= 0 ? idxDeck : -1;
      const dataRows = hasHeader ? rows.slice(1) : rows;
      if (!S.fc) S.fc = [];
      let added = 0, skipped = 0, invalid = 0;
      const topicsUsados = new Set();
      const coursesUsados = new Set();
      // O(1) dedup — precomputa keys existentes antes del loop
      const existingKeys = new Set();
      for (const c of S.fc) {
        existingKeys.add((c.course||'')+'\u0001'+(c.q||'')+'\u0001'+(c.a||''));
      }
      const seenInThisImport = new Set();
      dataRows.forEach(row => {
        const q = (row[fFront] || '').trim();
        const a = (row[fBack] || '').trim();
        if (!q || !a) { invalid++; return; }
        let course = '';
        if (fDeck >= 0) course = resolveCourseFromDeck(row[fDeck] || '');
        if (!course) course = fallbackCourse;
        if (!course) { invalid++; return; }
        const key = course+'\u0001'+q+'\u0001'+a;
        if (existingKeys.has(key) || seenInThisImport.has(key)) { skipped++; return; }
        seenInThisImport.add(key);
        const rawTags = fTags >= 0 ? (row[fTags] || '') : '';
        const niveles = rawTags.split('::').map(s => s.trim()).filter(Boolean);
        const etiquetas = [];
        if (niveles.length >= 1) etiquetas.push(niveles.join('::'));
        niveles.forEach(n => { if (!etiquetas.includes(n)) etiquetas.push(n); });
        const topic = resolveTopicFromTag(niveles[0], course);
        topicsUsados.add(topic);
        coursesUsados.add(course);
        S.fc.push({
          course, topic, etiquetas, q, a,
          ease: 2.5, interval: 0, due: today(),
          state: 'new', reps: 0, lapses: 0
        });
        added++;
      });
      if (added > 0) {
        _fcQueue = null;
        save();
        renderFC();
        if (typeof populateFCTagFilter === 'function') populateFCTagFilter();
      }
      let msg = '✓ ' + added + ' tarjeta' + (added === 1 ? '' : 's') + ' importada' + (added === 1 ? '' : 's');
      if (coursesUsados.size > 1) msg += ' · ' + coursesUsados.size + ' cursos';
      else if (coursesUsados.size === 1) msg += ' · ' + [...coursesUsados][0];
      if (topicsUsados.size) msg += ' · ' + topicsUsados.size + ' topic' + (topicsUsados.size === 1 ? '' : 's');
      if (skipped) msg += ' · ' + skipped + ' dup' + (skipped === 1 ? '' : 's');
      if (invalid) msg += ' · ' + invalid + ' inválida' + (invalid === 1 ? '' : 's');
      if (status) status.innerHTML = '<span style="color:' + (added ? 'var(--accent3)' : 'var(--accent4)') + '">' + msg + '</span>';
    } catch (err) {
      if (status) status.innerHTML = '<span style="color:var(--accent2)">⚠ Error al leer el archivo: ' + err.message + '</span>';
    }
  };
  reader.readAsText(file, 'UTF-8');
  setTimeout(() => { const el = document.getElementById('fcImportFile'); if (el) el.value = ''; }, 100);
}
// ═══ PEGAR FLASHCARDS EN TEXTO LIBRE ═══
function togglePasteFC(){
  const wrap = document.getElementById('pasteFCWrap');
  const btn = document.getElementById('pasteFCToggle');
  if(!wrap) return;
  const visible = wrap.style.display !== 'none';
  wrap.style.display = visible ? 'none' : 'block';
  if(btn) btn.textContent = visible ? 'mostrar ▾' : 'ocultar ▴';
}

function parsePasteFC(text){
  if(!text || !text.trim()) return [];
  const partes = text.split(/\n\s*---+\s*\n|\n\s*\n/).filter(b => b.trim());
  const bloques = [];
  partes.forEach(bloque => {
    const q = (bloque.match(/^(?:Q|P|Pregunta|Anverso)\s*[:：]\s*(.+)$/im) || [])[1] || '';
    const r = (bloque.match(/^(?:R|Respuesta|Reverso|A)\s*[:：]\s*(.+)$/im) || [])[1] || '';
    const t = (bloque.match(/^(?:Tipo|Type|Categoría)\s*[:：]\s*(.+)$/im) || [])[1] || '';
    if(q.trim() && r.trim()) bloques.push({q: q.trim(), r: r.trim(), t: t.trim()});
  });
  return bloques;
}

function convertPasteFC(){
  const course = document.getElementById('pasteFCCourse').value;
  const topicName = document.getElementById('pasteFCTopic').value;
  const tipoDefault = document.getElementById('pasteFCTipo').value.trim() || 'Definición';
  const texto = document.getElementById('pasteFCInput').value;
  const status = document.getElementById('pasteFCStatus');

  if(!course){
    if(status) status.innerHTML = '<span style="color:var(--accent2)">⚠ Elegí un curso primero.</span>';
    return;
  }
  if(!TOPICS[course]){
    if(status) status.innerHTML = '<span style="color:var(--accent2)">⚠ Curso no reconocido.</span>';
    return;
  }
  if(!topicName){
    if(status) status.innerHTML = '<span style="color:var(--accent2)">⚠ Elegí un tema.</span>';
    return;
  }

  const bloques = parsePasteFC(texto);
  const totalBloques = texto.split(/\n\s*---+\s*\n|\n\s*\n/).filter(b => b.trim()).length;

  if(!bloques.length){
    if(status) status.innerHTML = '<span style="color:var(--accent2)">⚠ No se detectaron flashcards. Detecté ' + totalBloques + ' bloque(s) pero ninguno tiene "Q:" y "R:" válidos al inicio de línea.</span>';
    return;
  }

  if(!S.fc) S.fc = [];
  let added = 0, skipped = 0;

  bloques.forEach(b => {
    const tipo = b.t || tipoDefault;
    const etiquetaFull = topicName + '::' + tipo;
    const etiquetas = [etiquetaFull, topicName, tipo];

    const exists = S.fc.some(c => c.q === b.q && c.a === b.r && c.course === course);
    if(exists){ skipped++; return; }

    S.fc.push({
      course, topic: topicName, etiquetas,
      q: b.q, a: b.r,
      ease: 2.5, interval: 0, due: today(),
      state: 'new', reps: 0, lapses: 0
    });
    added++;
  });

  if(added > 0){
    _fcQueue = null;
    save();
    renderFC();
    if(typeof populateFCTagFilter === 'function') populateFCTagFilter();
  }

  let msg = '✓ ' + added + ' agregada' + (added === 1 ? '' : 's') + ' · tema: ' + topicName;
  if(skipped) msg += ' · ' + skipped + ' dup' + (skipped === 1 ? '' : 's');
  if(totalBloques > bloques.length) msg += ' · ' + (totalBloques - bloques.length) + ' bloque(s) descartado(s)';

  if(status) status.innerHTML = '<span style="color:' + (added ? 'var(--accent3)' : 'var(--accent4)') + '">' + msg + '</span>';

  if(added > 0){
    document.getElementById('pasteFCInput').value = '';
  }
}

function initFCImportCourseSelect(){
  ['fcImportCourse', 'pasteFCCourse'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    Object.keys(TOPICS).forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
  });
}

// ── MOTOR ANKI ──
let _fcQueue=null;

function getDueCards(){
  if(!S.fc)return[];
  const t=today();
  if(!S.fcConfig)S.fcConfig={newPerDay:20,reviewPerDay:200};
  if(!S.fcToday||S.fcToday.date!==t){
    S.fcToday={date:t,newDone:0,reviewDone:0};
    save();
  }
  const course=document.getElementById('fcFilterCourse')?.value||'';
  const topic=document.getElementById('fcFilterTopic')?.value||'';
  const tipo=document.getElementById('fcFilterTipo')?.value||'';

  const pool=S.fc.filter(c=>{
    if(course && c.course!==course)return false;
    if(topic && c.topic!==topic)return false;
    if(tipo && !(c.etiquetas||[]).includes(tipo))return false;
    return (c.due||today())<=t;
  });

  const news=pool.filter(c=>c.state==='new');
  const reviews=pool.filter(c=>c.state!=='new');



  // ── Auto-ajuste runtime (no persiste) ──
  const t2=today();
  const atrasadas=(S.fc||[]).filter(c=>c.state!=='new'&&(c.due||t2)<t2).length;
  const baseReview=S.fcConfig.reviewPerDay||2500;

  let dynamicReview=baseReview;
  let dynamicNew=S.fcConfig.newPerDay||120;

  if(atrasadas>500){
    dynamicReview=Math.max(baseReview,1500);
    dynamicNew=Math.min(dynamicNew,60);
  } else if(atrasadas>200){
    dynamicReview=Math.max(baseReview,900);
    dynamicNew=Math.min(dynamicNew,100);
  }

  // Racha de backlog alto + alerta al tercer día seguido
  if(!S._backlogDays)S._backlogDays={date:'',count:0};
  if(atrasadas>200){
    if(S._backlogDays.date!==t2){
      S._backlogDays.date=t2;
      S._backlogDays.count++;
    }
    if(S._backlogDays.count>=3 && S._lastBacklogWarn!==t2){
      S._lastBacklogWarn=t2;
      setTimeout(()=>showToast('⚠ Llevás '+S._backlogDays.count+' días con +200 atrasadas. Bajá las nuevas a 30/día hasta bajar de 100.','error'),500);
    }
  } else {
    S._backlogDays.count=0;
  }

  const newLimit=Math.max(0,dynamicNew-S.fcToday.newDone);
  const reviewLimit=Math.max(0,dynamicReview-S.fcToday.reviewDone);

  return [
    ...reviews.slice(0,reviewLimit),
    ...news.slice(0,newLimit)
  ];
}



function addFC(){
  const course=document.getElementById('fcCourse').value;
  const topic=document.getElementById('fcTopic').value;
  const q=document.getElementById('fcQuestion').value.trim();
  const a=document.getElementById('fcAnswer').value.trim();
  if(!course||!topic||!q||!a)return;
  if(!S.fc)S.fc=[];
  S.fc.push({
    course,topic,q,a,
    etiquetas: [],
    ease:2.5,
    interval:0,
    due:today(),
    state:'new',
    reps:0,
    lapses:0
  });
  document.getElementById('fcQuestion').value='';
  document.getElementById('fcAnswer').value='';
  _fcQueue=null;
  save();
  renderFC();
}

function renderFC(){
  if(!S.fc)S.fc=[];
  if(!_fcQueue)_fcQueue=getDueCards();
  const t=today();
  _fcQueue=_fcQueue.filter(c=>(c.due||t)<=t);

  document.getElementById('fcCount').textContent=_fcQueue.length;

  const cardEl=document.getElementById('fcCard');
  const front=document.getElementById('fcFront');
  const back=document.getElementById('fcBack');
  const idx=document.getElementById('fcIdx');
  const nav=document.querySelector('.fc-nav');

  // ⬇️ NUEVO: resetear confianza al cambiar de tarjeta
  window._fcCurrentConfidence=null;

  if(!_fcQueue.length){
    front.innerHTML='<div style="font-size:.8rem;color:var(--accent3);text-align:center">✓ No hay tarjetas pendientes hoy.</div>';
    back.innerHTML='';
    idx.textContent='0/0';
    cardEl.classList.remove('flipped');
    cardEl.onclick=null;
    if(nav)nav.style.display='none';
    renderFCStats();
    renderFCProjection();
    return;
  }

  if(nav)nav.style.display='none';
  const card=_fcQueue[0];
  cardEl.classList.remove('flipped');
  // Self-explanation: reflexiones previas del tema
  const cardTopicId = findTopicIdByCourseAndName(card.course, card.topic);
  const cardMeta = cardTopicId ? (S.t||{})[cardTopicId] : null;
  const pastReflections = (cardMeta && Array.isArray(cardMeta.reflections)) ? cardMeta.reflections.slice(-3) : [];
  let reflectionBlock = '';
  if(pastReflections.length){
    reflectionBlock = '<details style="margin-top:.7rem;width:100%;text-align:left">'
      + '<summary style="cursor:pointer;font-size:.66rem;color:var(--accent2);padding:.25rem 0">📝 Tus reflexiones previas ('+pastReflections.length+')</summary>'
      + '<div style="margin-top:.4rem;padding:.5rem .65rem;background:#1f0a0f;border-left:2px solid var(--accent2);border-radius:4px">'
      + pastReflections.map(r => '<div style="font-size:.68rem;color:var(--muted);line-height:1.45;margin-bottom:.25rem">· '+r.text+' <span style="opacity:.5">('+r.date+')</span></div>').join('')
      + '</div>'
      + '</details>';
  }

  front.innerHTML='<button onclick="event.stopPropagation();delFC()" style="position:absolute;top:6px;right:6px;background:transparent;border:1px solid var(--border);color:var(--muted);font-size:.68rem;padding:.1rem .35rem;border-radius:4px;cursor:pointer;z-index:2" title="Borrar tarjeta">🗑 borrar</button>'
    +'<div style="font-size:.8rem;color:var(--muted);margin-bottom:.4rem">'+card.course+' · '+card.topic+'</div>'
    +'<div id="fcFrontContent" style="font-size:.8rem">'+card.q+'</div>'
    +'<div class="fc-conf-wrap">'
    +'  <div class="fc-conf-label">¿Qué tan seguro estás?</div>'
    +'  <div class="fc-conf-btns">'
    +'    <button class="fc-conf-btn low" onclick="event.stopPropagation();setFCConfidence(15)">😰<br><span>nada</span></button>'
    +'    <button class="fc-conf-btn low" onclick="event.stopPropagation();setFCConfidence(35)">🔴<br><span>dudo</span></button>'
    +'    <button class="fc-conf-btn mid" onclick="event.stopPropagation();setFCConfidence(55)">🟡<br><span>quizá</span></button>'
    +'    <button class="fc-conf-btn high" onclick="event.stopPropagation();setFCConfidence(80)">🟢<br><span>creo</span></button>'
    +'    <button class="fc-conf-btn high" onclick="event.stopPropagation();setFCConfidence(95)">✅<br><span>seguro</span></button>'
    +'  </div>'
    +'</div>'
    + reflectionBlock
    +'<div class="fc-hint">elegí confianza para ver la respuesta</div>';
  renderMath(document.getElementById('fcFrontContent'));
  back.innerHTML='';
  cardEl.onclick=null;  // ⬅️ ya no voltea con clic — debe elegir confianza primero
  idx.textContent=_fcQueue.length+' pendiente'+(_fcQueue.length===1?'':'s');
  renderFCStats();
}



function previewIntervals(card){
  const e=card.ease||2.5;
  const i=card.interval||0;
  const isNew=(card.state==='new'||i===0);
  const fmt=d=>{
    if(d<1)return '<1 min';
    if(d===1)return '1 día';
    if(d<30)return d+' días';
    if(d<365)return Math.round(d/30)+' meses';
    return (d/365).toFixed(1)+' años';
  };
  if(isNew)return{again:'1 min',hard:'6 min',good:'1 día',easy:'4 días'};
  return{
    again:'<1 min',
    hard:fmt(Math.max(1,Math.round(i*1.2))),
    good:fmt(Math.round(i*e)),
    easy:fmt(Math.round(i*e*1.3))
  };
}

function flipFC(){
  const cardEl=document.getElementById('fcCard');
  if(!cardEl)return;
  if(cardEl.classList.contains('flipped'))return;

  // Si no eligió confianza, no permite voltear
  if(!window._fcCurrentConfidence){
    const wrap=document.querySelector('.fc-conf-wrap');
    if(wrap){wrap.classList.add('shake');setTimeout(()=>wrap.classList.remove('shake'),400);}
    return;
  }

  const card=_fcQueue&&_fcQueue[0];
  if(!card)return;
  const back=document.getElementById('fcBack');
  const iv=previewIntervals(card);
  back.innerHTML='<div id="fcBackContent" style="font-size:.8rem;color:var(--accent3);margin-bottom:1rem;line-height:1.5">'+card.a+'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;margin-top:.5rem">'
    +'<button onclick="event.stopPropagation();rateFC(\'again\')" style="background:#2a1515;border:1px solid var(--accent2);color:var(--accent2);padding:.55rem .3rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem;line-height:1.35">Otra vez<br><span style="font-size:.68rem;opacity:.75">'+iv.again+'</span></button>'
    +'<button onclick="event.stopPropagation();rateFC(\'hard\')" style="background:#2a2510;border:1px solid var(--accent4);color:var(--accent4);padding:.55rem .3rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem;line-height:1.35">Difícil<br><span style="font-size:.68rem;opacity:.75">'+iv.hard+'</span></button>'
    +'<button onclick="event.stopPropagation();rateFC(\'good\')" style="background:#1a3520;border:1px solid var(--accent3);color:var(--accent3);padding:.55rem .3rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem;line-height:1.35">Bien<br><span style="font-size:.68rem;opacity:.75">'+iv.good+'</span></button>'
    +'<button onclick="event.stopPropagation();rateFC(\'easy\')" style="background:#1a2535;border:1px solid var(--accent);color:var(--accent);padding:.55rem .3rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem;line-height:1.35">Fácil<br><span style="font-size:.68rem;opacity:.75">'+iv.easy+'</span></button>'
    +'</div>';
  renderMath(document.getElementById('fcBackContent'));
  cardEl.classList.add('flipped');
}

function setFCConfidence(v){
  window._fcCurrentConfidence=v;
  document.querySelectorAll('.fc-conf-btn').forEach(b=>b.classList.remove('active'));
  const cls=v<=35?'low':v<75?'mid':'high';
  const btn=document.querySelector('.fc-conf-btn.'+cls);
  if(btn)btn.classList.add('active');
  setTimeout(()=>flipFC(),300);
}

// ═══ SELF-EXPLANATION ═══
let _reflectionTarget = null;

function _showReflectionPrompt(calEntry){
  _closeReflectionPrompt();
  _reflectionTarget = calEntry;
  const el = document.createElement('div');
  el.id = '_reflectionPrompt';
  el.style.cssText = 'position:fixed;bottom:calc(5rem + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--accent2);border-radius:10px;padding:.9rem 1rem;max-width:520px;width:calc(100% - 2rem);z-index:1400;box-shadow:0 12px 40px rgba(0,0,0,.55);animation:fadeIn .2s ease';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.55rem">'
    +'<span style="font-size:.9rem">🤔</span>'
    +'<span style="font-family:\'Syne\',sans-serif;font-weight:700;font-size:.74rem;color:var(--accent2);flex:1">Fallaste con alta confianza</span>'
    +'<button onclick="_skipReflection()" style="background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;border-radius:4px;font-size:.68rem;padding:.05rem .35rem;line-height:1">✕</button>'
    +'</div>'
    +'<div style="font-size:.68rem;color:var(--muted);margin-bottom:.5rem;line-height:1.4">¿Por qué creías que era otra cosa? (opcional, una línea)</div>'
    +'<input type="text" id="_reflectionInput" placeholder="ej: confundí el signo..." maxlength="140" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.45rem .6rem;font-family:\'DM Mono\',monospace;font-size:.72rem;border-radius:4px;outline:none">'
    +'<div style="display:flex;gap:.35rem;margin-top:.55rem;justify-content:flex-end">'
    +'<button onclick="_skipReflection()" style="padding:.32rem .75rem;background:transparent;border:1px solid var(--border);color:var(--muted);border-radius:4px;cursor:pointer;font-family:inherit;font-size:.66rem">Saltar</button>'
    +'<button onclick="_saveReflection()" style="padding:.32rem .75rem;background:var(--accent2);border:none;color:#000;border-radius:4px;cursor:pointer;font-family:inherit;font-size:.66rem;font-weight:700">Guardar</button>'
    +'</div>';
  document.body.appendChild(el);
  const inp = document.getElementById('_reflectionInput');
  if(inp){
    inp.focus();
    inp.addEventListener('keydown', e => {
      if(e.key === 'Enter'){ e.preventDefault(); _saveReflection(); }
      if(e.key === 'Escape'){ e.preventDefault(); _skipReflection(); }
    });
  }
  clearTimeout(window._reflectionTimeout);
  window._reflectionTimeout = setTimeout(_skipReflection, 45000);
}

function _saveReflection(){
  const inp = document.getElementById('_reflectionInput');
  const txt = (inp?.value || '').trim();
  const cal = _reflectionTarget;
  if(txt && cal){
    cal.reflection = txt;
    if(cal.topicId){
      const meta = ensureTopicMetadata(cal.topicId);
      if(!meta.reflections) meta.reflections = [];
      meta.reflections.push({ text: txt, date: today(), ts: Date.now() });
      if(meta.reflections.length > 10) meta.reflections = meta.reflections.slice(-10);
    }
    save();
    showToast('✓ Reflexión guardada','success');
  }
  _closeReflectionPrompt();
}

function _skipReflection(){
  _closeReflectionPrompt();
}

function _closeReflectionPrompt(){
  clearTimeout(window._reflectionTimeout);
  _reflectionTarget = null;
  document.getElementById('_reflectionPrompt')?.remove();
}
// ═══ FIN SELF-EXPLANATION ═══

function rateFC(rating){
  if(!_fcQueue||!_fcQueue.length)return;
  const card=_fcQueue[0];
  if(!S.fc)S.fc=[];
  const realCard=S.fc.find(c=>c===card)||S.fc.find(c=>c.q===card.q&&c.a===card.a&&c.course===card.course);
  if(!realCard)return;

  const e=realCard.ease||2.5;
  const i=realCard.interval||0;
  const isNew=(realCard.state==='new'||i===0);

  if(rating==='again'){
    realCard.ease=Math.max(1.3,e-0.20);
    realCard.lapses=(realCard.lapses||0)+1;
    realCard.state='learning';
    realCard.interval=0;
    realCard.due=localKey(new Date(Date.now()+60*1000));
  }
  else if(rating==='hard'){
    realCard.ease=Math.max(1.3,e-0.15);
    realCard.interval=isNew?1:Math.max(1,Math.round(i*1.2));
    realCard.state='review';
    realCard.due=localKey(new Date(Date.now()+realCard.interval*86400000));
  }
  else if(rating==='good'){
    realCard.interval=isNew?1:Math.round(i*e);
    realCard.state='review';
    realCard.due=localKey(new Date(Date.now()+realCard.interval*86400000));
  }
  else if(rating==='easy'){
    realCard.ease=Math.min(2.8,e+0.15);
    realCard.interval=isNew?4:Math.round(i*e*1.3);
    realCard.state='review';
    realCard.due=localKey(new Date(Date.now()+realCard.interval*86400000));
  }
    if(!S.fcToday||S.fcToday.date!==today())S.fcToday={date:today(),newDone:0,reviewDone:0};
  const wasNew=isNew;
  if(wasNew)S.fcToday.newDone=(S.fcToday.newDone||0)+1;
  else S.fcToday.reviewDone=(S.fcToday.reviewDone||0)+1;
  realCard.reps=(realCard.reps||0)+1;
  realCard.lastReview=today();

    // Conectar con el grafo: actualizar dominio del tema según el rating
  const perfMap={again:15, hard:55, good:80, easy:100};
  const performance=perfMap[rating]!==undefined?perfMap[rating]:50;
  const topicId=findTopicIdByCourseAndName(realCard.course, realCard.topic);
  if(topicId){
    StudyPrioritizer.updateDominio(topicId, performance);
  }

  // Calibración metacognitiva: guardar (confianza, acierto)
  const confidence=window._fcCurrentConfidence||60;
  const correct=(rating==='good'||rating==='easy');
  if(!S.calibration)S.calibration=[];
  const calEntry={
    source:'fc',
    topicId:topicId||null,
    course:realCard.course,
    topic:realCard.topic,
    confidence,
    correct,
    rating,
    date:today(),
    ts:Date.now()
  };
  S.calibration.push(calEntry);
  // Limitar a 2000 registros
  if(S.calibration.length>2000)S.calibration=S.calibration.slice(-2000);
  window._fcCurrentConfidence=null;

  // ═══ SELF-EXPLANATION: solo si fallaste con alta confianza ═══
  const isFail = (rating==='again' || rating==='hard');
  const triggerReflection = confidence >= 75 && isFail;

  _fcQueue.shift();
  save();
  renderFC();

  if(triggerReflection){
    _showReflectionPrompt(calEntry);
  }
}



function renderFCStats(){
  const el=document.getElementById('fcStats');
  if(!el)return;
  if(!S.fc||!S.fc.length){el.innerHTML='<span style="color:var(--muted)">Sin tarjetas.</span>';return;}

  const t=today();
  const tmrw=localKey(new Date(Date.now()+86400000));

  if(!S.fcConfig)S.fcConfig={newPerDay:20,reviewPerDay:200};
  if(!S.fcToday||S.fcToday.date!==t)S.fcToday={date:t,newDone:0,reviewDone:0};

  // Conteos reales SIN filtro
  const all=S.fc;
  const newCount=all.filter(c=>c.state==='new').length;
  const atrasadas=all.filter(c=>c.state!=='new'&&(c.due||t)<t).length;
  const hoy=all.filter(c=>c.state!=='new'&&(c.due||t)===t).length;
  const manana=all.filter(c=>c.state!=='new'&&(c.due||t)===tmrw).length;
  const learning=all.filter(c=>c.state==='learning').length;
  const total=all.length;

  // Ratio de salud
  const pendientesHoy=atrasadas+hoy;
  const ratio=pendientesHoy>0?atrasadas/pendientesHoy:0;
  let dot='🟢',dotColor='var(--accent3)',dotLabel='sano';
  if(ratio>=0.5){dot='🔴';dotColor='var(--accent2)';dotLabel='crítico';}
  else if(ratio>=0.2){dot='🟠';dotColor='#f0a500';dotLabel='atrasado';}
  else if(ratio>=0.1){dot='🟡';dotColor='var(--accent4)';dotLabel='cuidado';}

  // Aviso de filtro activo
  const fcCurso=document.getElementById('fcFilterCourse')?.value||'';
  const fcTema=document.getElementById('fcFilterTopic')?.value||'';
  const fcTipo=document.getElementById('fcFilterTipo')?.value||'';
  let filtroAviso='';
  if(fcCurso||fcTema||fcTipo){
    const parts=[fcCurso,fcTema,fcTipo].filter(Boolean);
    filtroAviso='<div style="width:100%;font-size:.66rem;color:#f0a500;margin-top:.3rem;padding-top:.3rem;border-top:1px solid var(--border)">⚠ Filtro activo: <b>'+parts.join(' · ')+'</b> — los conteos de abajo son totales, la sesión solo te muestra las que matchean</div>';
  }

  el.innerHTML=
    '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:.6rem;width:100%">'
    +'<span style="font-size:.9rem" title="'+dotLabel+'">'+dot+'</span>'
    +'<span style="color:'+(atrasadas>0?'var(--accent2)':'var(--muted)')+'"><b>'+atrasadas+'</b> atrasadas</span>'
    +'<span style="color:var(--accent4)"><b>'+hoy+'</b> hoy</span>'
    +'<span style="color:var(--muted)"><b>'+newCount+'</b> nuevas</span>'
    +'<span style="color:var(--muted);opacity:.7">· mañana: <b>'+manana+'</b></span>'
    +'<span style="color:var(--muted);opacity:.7">· total: <b>'+total+'</b></span>'
    +'</div>'
    +filtroAviso;
}




// ── CALENDARIO (sincronizado con WSCHED del plan) ──


function getWeekForDate(ds){
  return WSCHED.find(w=>ds>=w.s&&ds<=w.e)||null;
}
function getCalDayInfo(ds){
  if(ds===EXAM_DATE)return{label:'EXAM',course:'Examen UNI',color:'var(--accent2)',weekId:'exam'};
  const w=getWeekForDate(ds);
  if(!w)return null;
  const weekNumber=parseInt(w.id.replace('w',''));
  const special=PLAN_SPECIAL_WEEKS[weekNumber];
  if(special){
    return{label:'S'+weekNumber,course:special.badge,color:special.color,weekId:w.id};
  }
  return{label:'S'+weekNumber,course:'Temario nuevo',color:'var(--accent4)',weekId:w.id};
}

function renderCalendar(){
  const months=[{y:2026,m:7},{y:2026,m:8},{y:2026,m:9},{y:2026,m:10},{y:2026,m:11},{y:2027,m:0},{y:2027,m:1}];
  const names=['Agosto','Septiembre','Octubre','Noviembre','Diciembre','Enero','Febrero'];
  const td=today();
  const container=document.getElementById('calContainer');
  if(!container)return;
  const sub=document.querySelector('#view-calendar .subtitle');
  if(sub)sub.textContent='10 de agosto de 2026 – 15 de febrero de 2027 · horario alternado · Lunes = primera columna.';
  renderStudySchedule();
  container.innerHTML=months.map((mo,mi)=>{
    const days=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const hdr='<div class="cal-hdr">'+days.map(d=>'<div>'+d+'</div>').join('')+'</div>';
    const firstDay=(new Date(mo.y,mo.m,1).getDay()+6)%7;
    const daysInMonth=new Date(mo.y,mo.m+1,0).getDate();
    let cells='';
    for(let i=0;i<firstDay;i++)cells+='<div class="cal-spacer"></div>';
    for(let d=1;d<=daysInMonth;d++){
      const date=new Date(mo.y,mo.m,d,12,0,0,0);
      const ds=localKey(date);
      const info=getCalDayInfo(ds);
      const isToday=ds===td;
      const isExam=ds===EXAM_DATE;
      const studyH=(S.h||{})[ds]||0;
      const inPlan=ds>=SCHEDULE_START&&ds<=SCHEDULE_END;
      let style='';
      if(info)style='background:'+info.color+'22;border-color:'+info.color+'55';
      if(isExam)style='background:rgba(255,106,106,.15);border-color:var(--accent2)';
      const todayStyle=isToday?'outline:2px solid var(--accent3);':'';
      const examStyle=isExam?'font-weight:700;color:var(--accent2);':'';
      cells+='<div class="cal-day'+(info||isExam?' has-course':'')+'" style="'+style+todayStyle+'" title="'+(info?info.course+(info.weekId?' · '+info.weekId:''):'Fuera del plan')+'">'
        +'<div class="cal-dn" style="'+examStyle+'">'+d+'</div>'
        +(info?'<div class="cal-course" style="color:'+info.color+'">'+info.label+'</div>':'')
        +(studyH>0?'<div style="font-size:.38rem;color:var(--accent3)">'+fmt(studyH)+'</div>':'')
        +(!inPlan?'<div style="font-size:.36rem;color:var(--border)">—</div>':'')
        +'</div>';
    }
    return'<div class="cal-month"><div class="cal-title">'+names[mi]+' '+mo.y+'</div>'+hdr+'<div class="cal-grid">'+cells+'</div></div>';
  }).join('');
}

// ── STATS VIEW ──
function renderStats(){
  renderH();renderE();renderSim();renderSimLog();renderWS();renderHeatmap();renderPrediction();renderConsistencyChart();
  renderSpeedStats();
  renderSpeedTargetsEditor();
  renderSimulacrosPanel();
  const dateEl=document.getElementById('simLogDate');
  if(dateEl&&!dateEl.value)dateEl.value=today();
  // Init preset chips with current course select value
  renderGlobalErrPresets();
  renderCalibration();
}

// ── BACKUP ──
function exportB(){
  S._v=DATA_VERSION;
  S._savedAt=Date.now();
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='uni-luis-backup-'+today()+'.json';a.click();
  renderSyncHint();
}
function importB(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      S=JSON.parse(e.target.result);
      migrateData();
      save();
      renderAll();
      showToast('✓ Backup importado (v'+(S._v||'?')+')','success');
    }
    catch(err){showToast('⚠ Archivo inválido','error');;}
  };
  reader.readAsText(file);input.value='';
}
function exportTxt(){
  const cs=['Aritmética','Álgebra','Física','Geometría','Trigonometría','Química'];
  let txt='PLAN UNI – LUIS MORI 2026\n'+'='.repeat(40)+'\n';
  txt+='Fecha: '+today()+'\n\n';
  const all=document.querySelectorAll('.ti[data-id]').length;
  const done=document.querySelectorAll('.ti[data-id].done').length;
  txt+='PROGRESO GENERAL: '+done+'/'+all+' caps ('+Math.round(done/all*100)+'%)\n\n';
  txt+='HORAS POR CURSO:\n';
  cs.forEach(c=>txt+='  '+c+': '+fmt((S.h||{})['c'+c]||0)+'\n');
  txt+='\nERRORES REGISTRADOS ('+((S.errors||[]).length)+'):\n';
  (S.errors||[]).forEach((e,i)=>txt+='  '+(i+1)+'. '+e+'\n');
  txt+='\nSIMULACROS:\n';
  const SL=['Mate S1','Mate S2','Mate S3','Fís S1','Fís S2','Quím S1','Quím S2'];
  SL.forEach((l,i)=>txt+='  '+l+': '+((S.sim||{})[i]||'—')+'/100\n');
  txt+='\nEXAMEN UNI: '+EXAM_DATE+'\n';
  const blob=new Blob([txt],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='resumen-uni-luis-'+today()+'.txt';a.click();
}

// ── TOPIC LIST FOR POMODORO ──

function updateTopicList(){
  const course=document.getElementById('pcourse').value;
  const sel=document.getElementById('ptopic');

  const topics=Object.values(TOPICS[course]||{});

  sel.innerHTML='<option value="" disabled selected hidden>tema</option>'+topics.map(t=>'<option value="'+t+'">'+t+'</option>').join('');
  _fcQueue=null;
}
// Initialize pomodoro with active topic
function initPomoWithActiveTopic(){
  const td=today();
  const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);
  if(!aw)return;
  const undone=aw.topics.filter(id=>!(S.t||{})[id]?.done);
  if(!undone.length)return;
  const nextId=undone[0];
  const {course,name}=getTopic(nextId);
  if(!course)return;
  const pcourseSel=document.getElementById('pcourse');
  const ptopicSel=document.getElementById('ptopic');
  if(pcourseSel&&course){
    pcourseSel.value=course;
    updateTopicList();
    if(ptopicSel&&name){
      setTimeout(()=>{
        ptopicSel.value=name;
      },50);
    }
  }
}

// ── TOPIC TIME DISPLAY IN PLAN ──
function renderTopicTimes(){
  if(!S.topicTime)return;
  document.querySelectorAll('.ti[data-id]').forEach(el=>{
    const {name,course}=getTopic(el.dataset.id);
    if(!name||!course)return;
    // Try exact key first, then partial match (pomodoro topic names may differ slightly)
    const k=course+'::'+name;
    let data=S.topicTime[k];
    // If no exact match, try to find by partial topic name match
    if(!data){
      const partial=Object.entries(S.topicTime).find(([key,val])=>{
        const [kc,kt]=key.split('::');
        if(kc!==course)return false;
        // match by cap number e.g. "Cap. I" or "Cap. VII"
        const capA=name.match(/Cap\.\s*([\w]+)/i);
        const capB=kt.match(/Cap\.\s*([\w]+)/i);
        return capA&&capB&&capA[1]===capB[1];
      });
      if(partial)data=partial[1];
    }
    if(!data||!data.total)return;
    let badge=el.querySelector('.topic-time-badge');
    if(!badge){
      badge=document.createElement('span');
      badge.className='topic-time-badge';
      badge.style.cssText='font-size:.64rem;color:var(--accent3);border:1px solid #1a3520;padding:.02rem .22rem;margin-left:.3rem;white-space:nowrap;vertical-align:middle;cursor:default';
      const tn=el.querySelector('.tn');
      if(tn)tn.appendChild(badge);
    }
    const te=data.teoria||0,ex=data.ejercicios||0,re=data.repaso||0;
    const h=data.total/3600;
    badge.textContent=h.toFixed(1)+'h';
    badge.title='Teoría: '+fmt(te)+' · Ejer: '+fmt(ex)+' · Repaso: '+fmt(re);
  });
}

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
  // Si el simulacro está abierto, ignorar atajos globales
  const _simOv=document.getElementById('simOverlay');
  if(_simOv&&_simOv.style.display==='flex')return;
  if(e.code==='Space'){e.preventDefault();pRun?pa('pause'):pa('start');}
  if(e.key==='f'||e.key==='F')enterF();
  if(e.key==='e'||e.key==='E')enterExamMode();
  if(e.key==='s'||e.key==='S'){document.getElementById('searchinput').focus();}
  if(e.key==='w'||e.key==='W')filterWeekPending();
  if(e.key==='t'||e.key==='T')toggleTheme();
  if(e.key==='Escape'){exitF();exitExamMode();document.getElementById('fabWrap')?.classList.remove('open');}
});
document.addEventListener('click',e=>{
  const ti=e.target.closest('.ti[data-id]');
  if(ti)lastFocusedTopicId=ti.dataset.id;
});

// ── MENÚ LATERAL (móvil: overlay · PC: colapsado a íconos) ──
function isMobileLayout(){return window.matchMedia('(max-width:768px)').matches}
function toggleSidebar(){
  if(isMobileLayout()){
    document.body.classList.toggle('sidebar-open');
  }else{
    document.body.classList.toggle('sidebar-collapsed');
  }
}
window.addEventListener('resize',()=>{
  if(!isMobileLayout())document.body.classList.remove('sidebar-open');
});
document.addEventListener('click',e=>{
  if(!isMobileLayout()||!document.body.classList.contains('sidebar-open'))return;
  if(e.target.closest('.sidebar')||e.target.closest('.mobile-menu-btn'))return;
  document.body.classList.remove('sidebar-open');
});

// ── CLEAR ALL DATA ──
function clearAllData(){
  if(confirm('¿Estás seguro de que quieres borrar Todos los datos? Esta acción no se puede deshacer.')){
    localStorage.removeItem(KEY);
    S={};
    save();
    renderAll();
    showToast('Datos borrados. La página se recargará.');
    location.reload();
  }
}

// ── BREAK TIMER ──
let brkInt=null, brkSecs=0, brkRun=false, brkTarget=300;

function startBreak(targetSecs){
  brkRun=true;brkSecs=0;brkTarget=targetSecs||300;
  const brkStart=Date.now();
  const btn=document.getElementById('bbreak');
  const wrap=document.getElementById('breakTimerWrap');
  if(btn){btn.textContent='■ terminar descanso';btn.style.borderColor='var(--accent4)';btn.style.color='var(--accent4)';}
  if(wrap)wrap.style.display='block';
  upBreakDisp();
  brkInt=setInterval(()=>{
    brkSecs=Math.floor((Date.now()-brkStart)/1000);
    upBreakDisp();
    if(brkSecs>=brkTarget){playZenAlarm();stopBreak(true);}
  },1000);
}
function stopBreak(log){
  brkRun=false;clearInterval(brkInt);
  const btn=document.getElementById('bbreak');
  const wrap=document.getElementById('breakTimerWrap');
  if(btn){btn.textContent='☕ iniciar descanso';btn.style.borderColor='var(--border)';btn.style.color='var(--muted)';}
  if(wrap)wrap.style.display='none';
  // we do NOT log break time here — only the recommended break from pa('stop') is stored
  brkSecs=0;upBreakDisp();
}
function upBreakDisp(){
  const m=String(Math.floor(brkSecs/60)).padStart(2,'0'),s=String(brkSecs%60).padStart(2,'0');
  const el=document.getElementById('breakTimerDisp');
  if(el)el.textContent=m+':'+s;
}

// ── RESET POMODORO ──
function resetPomo(){
  clearInterval(pInt);
  pRun=false;pSec=1500;pEl=0;
  S.pomo={running:false,sec:1500,elapsed:0};
  save();upPD();
  document.getElementById('bstart').classList.remove('on');
  const bsEl=document.getElementById('pomoBreakSug');
  if(bsEl)bsEl.textContent=getBreakSuggestion(1500);
}






// ── AUTO-SAVE INDICATOR ──
let saveTimeout=null;
function showSaveIndicator(){
  const el=document.getElementById('saveIndicator');
  if(el){el.style.opacity='1';clearTimeout(saveTimeout);saveTimeout=setTimeout(()=>el.style.opacity='0',1500);}
}

// ── THEME TOGGLE (FUTURE) ──
function toggleTheme(){
  document.body.classList.toggle('light-theme');
  const isLight=document.body.classList.contains('light-theme');
  localStorage.setItem('theme',isLight?'light':'dark');
}

// ── LOAD THEME PREFERENCE ──
function loadThemePreference(){
  const theme=localStorage.getItem('theme');
  if(theme==='light')document.body.classList.add('light-theme');
}

// ── OFFLINE MODE ──
let isOnline=navigator.onLine;
function updateOnlineStatus(){
  isOnline=navigator.onLine;
  const indicator=document.getElementById('offlineIndicator');
  if(indicator){
    if(!isOnline){
      indicator.style.display='flex';
      indicator.innerHTML='⚠ Sin conexión - Modo offline';
    }else{
      indicator.style.display='none';
    }
  }
}
window.addEventListener('online',updateOnlineStatus);
window.addEventListener('offline',updateOnlineStatus);
// Create offline indicator
document.addEventListener('DOMContentLoaded',()=>{
  const indicator=document.createElement('div');
  indicator.id='offlineIndicator';
  indicator.style.cssText='position:fixed;top:0;left:0;right:0;background:var(--accent2);color:#fff;padding:.3rem;text-align:center;font-size:.68rem;z-index:9999;display:none;align-items:center;justify-content:center;gap:.3rem';
  document.body.appendChild(indicator);
  updateOnlineStatus();
  initFCCourses();
  initFCImportCourseSelect();   
});

// ── CUSTOM THEMES ──
const DEFAULT_COLORS={
  '--accent':'#6366f1',
  '--accent2':'#f43f5e',
  '--accent3':'#34d399',
  '--accent4':'#38bdf8',
  '--ca':'#38bdf8',
  '--calg':'#fb923c',
  '--cf':'#ec4899',
  '--cg':'#86efac',
  '--ct':'#a78bfa',
  '--cq':'#22c55e',
  '--crm':'#fde047',
  '--crv':'#d8b4fe',
  '--chu':'#eab308',
  '--chp':'#ef4444',
  '--cge':'#14b8a6',
  '--cfi':'#a855f7',
  '--cli':'#fb7185',
  '--cle':'#06b6d4',
  '--cin':'#6366f1',
  '--text':'#e5e5e5',
  '--muted':'#737373',
  '--border':'#262626',
  '--bg':'#0a0a0f'
};

// Mapeo curso → variable CSS
const COURSE_VAR = {
  'Aritmética':'--ca',
  'Álgebra':'--calg',
  'Física':'--cf',
  'Geometría':'--cg',
  'Trigonometría':'--ct',
  'Química':'--cq',
  'Raz. Matemático':'--crm',
  'Raz. Verbal':'--crv',
  'Historia Universal':'--chu',
  'Historia del Perú':'--chp',
  'Geografía':'--cge',
  'Filosofía':'--cfi',
  'Literatura':'--cli',
  'Lenguaje':'--cle',
  'Inglés':'--cin',
  'Economía':'--crm',
  'Psicología':'--cfi',
  'Actualidad':'--cle',
  'Simulacros':'--accent4'
};

// Devuelve el color actual del curso (leído del CSS en runtime)
function courseColor(course){
  const varName = COURSE_VAR[course];
  if(!varName) return '#888';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#888';
}

// Recalcula COURSE_RGB a partir del CSS actual
function refreshCourseRGB(){
  const keys = Object.keys(COURSE_VAR);
  keys.forEach(c => {
    const hex = courseColor(c);
    if(/^#[0-9a-f]{6}$/i.test(hex)){
      COURSE_RGB[c] = [
        parseInt(hex.slice(1,3),16),
        parseInt(hex.slice(3,5),16),
        parseInt(hex.slice(5,7),16)
      ];
    }
  });
}

// COURSE_RGB dinámico
const COURSE_RGB = {};
function applyCustomTheme(colors){
  if(!colors)return;
  Object.entries(colors).forEach(([varName,value])=>{
    document.documentElement.style.setProperty(varName,value);
  });
  refreshCourseRGB();
  // Re-renderizar todo lo que usa colores
  if(typeof renderAll==='function') renderAll();
}
function saveCustomTheme(colors){
  localStorage.setItem('customTheme',JSON.stringify(colors));
}
function loadCustomTheme(){
  const saved=localStorage.getItem('customTheme');
  if(saved){
    try{
      const colors=JSON.parse(saved);
      applyCustomTheme(colors);
    }catch(e){}
  }
}
function resetTheme(){
  localStorage.removeItem('customTheme');
  applyCustomTheme(DEFAULT_COLORS);
    showToast('✓ Tema restablecido','success');
}
function openThemeConfig(){
  const modal=document.createElement('div');
  modal.id='themeConfigModal';
  modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000';
  modal.innerHTML='<div style="background:#0a0a0f;border:1px solid var(--border);border-radius:8px;padding:1.5rem;max-width:500px;max-height:80vh;overflow-y:auto;width:90%">'
    +'<h2 style="margin:0 0 1rem 0;color:var(--text)">Configurar tema</h2>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Accent</label><input type="color" id="tc-accent" value="#ff6b35" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Accent 2 (Error)</label><input type="color" id="tc-accent2" value="#ef4444" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Accent 3 (Success)</label><input type="color" id="tc-accent3" value="#22c55e" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Accent 4 (Warning)</label><input type="color" id="tc-accent4" value="#f59e0b" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Aritmética</label><input type="color" id="tc-ca" value="#38bdf8" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Álgebra</label><input type="color" id="tc-calg" value="#fb923c" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Física</label><input type="color" id="tc-cf" value="#ec4899" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Geometría</label><input type="color" id="tc-cg" value="#86efac" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Trigonometría</label><input type="color" id="tc-ct" value="#a78bfa" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Química</label><input type="color" id="tc-cq" value="#22c55e" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Raz. Matemático</label><input type="color" id="tc-crm" value="#fde047" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Raz. Verbal</label><input type="color" id="tc-crv" value="#d8b4fe" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Historia Universal</label><input type="color" id="tc-chu" value="#eab308" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Historia del Perú</label><input type="color" id="tc-chp" value="#ef4444" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Geografía</label><input type="color" id="tc-cge" value="#14b8a6" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Filosofía</label><input type="color" id="tc-cfi" value="#a855f7" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Literatura</label><input type="color" id="tc-cli" value="#fb7185" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Lenguaje</label><input type="color" id="tc-cle" value="#06b6d4" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Inglés</label><input type="color" id="tc-cin" value="#6366f1" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Texto</label><input type="color" id="tc-text" value="#e5e5e5" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Muted</label><input type="color" id="tc-muted" value="#737373" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Border</label><input type="color" id="tc-border" value="#262626" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'<div><label style="display:block;font-size:.68rem;color:var(--muted);margin-bottom:.3rem">Background</label><input type="color" id="tc-bg" value="#0a0a0f" style="width:100%;height:40px;border:none;border-radius:4px;cursor:pointer"></div>'
    +'</div>'
    +'<div style="display:flex;gap:.5rem;margin-top:1.5rem">'
    +'<button onclick="saveThemeConfig()" style="flex:1;padding:.4rem;background:var(--accent);color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:600">Guardar</button>'
    +'<button onclick="closeThemeConfig()" style="flex:1;padding:.4rem;background:var(--border);color:var(--text);border:none;border-radius:4px;cursor:pointer">Cancelar</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(modal);
  // Load current values
  const saved=localStorage.getItem('customTheme');
  if(saved){
    try{
      const colors=JSON.parse(saved);
      Object.entries(colors).forEach(([key,value])=>{
        const input=document.getElementById('tc-'+key.replace('--',''));
        if(input)input.value=value;
      });
    }catch(e){}
  }
}
function closeThemeConfig(){
  const modal=document.getElementById('themeConfigModal');
  if(modal)modal.remove();
}
function saveThemeConfig(){
  const colors={};
  Object.keys(DEFAULT_COLORS).forEach(key=>{
    const input=document.getElementById('tc-'+key.replace('--',''));
    if(input)colors[key]=input.value;
  });
  applyCustomTheme(colors);
  saveCustomTheme(colors);
  closeThemeConfig();
  showToast('✓ Tema guardado','success');
}

// ── SYNC WITH CLOUD (Google Drive/Dropbox) ──
async function exportForSync(){
  const syncData={
    version:1,
    timestamp:Date.now(),
    data:S,
    customTheme:localStorage.getItem('customTheme'),
    theme:localStorage.getItem('theme')
  };
  const blob=new Blob([JSON.stringify(syncData,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='uni-plan-sync-'+new Date().toISOString().split('T')[0]+'.json';
  a.click();
  URL.revokeObjectURL(url);
}
async function importFromSync(file){
  try{
    const text=await file.text();
    const syncData=JSON.parse(text);
    if(syncData.data){
      Object.assign(S,syncData.data);
      save();
      if(syncData.customTheme){
        localStorage.setItem('customTheme',syncData.customTheme);
        loadCustomTheme();
      }
      if(syncData.theme){
        localStorage.setItem('theme',syncData.theme);
        loadThemePreference();
      }
      // Forzar flush de fc a IDB antes de recargar
      if(Array.isArray(S.fc) && S.fc.length){
        console.log('Flush de '+S.fc.length+' cards a IDB antes de recargar...');
        clearTimeout(_fcSaveTimer);
        await _flushFCSave();
        console.log('Flush OK');
      }
      renderAll();
      showToast('✓ Datos sincronizados correctamente. La página se recargará.', 'success');
      setTimeout(()=>location.reload(),1000);
    }
  }catch(err){
    showToast('Error al importar datos: '+err.message, 'error');
  }
}





// ═══════════════════════════════════════════════════════════════
// MEJORAS v10
// ═══════════════════════════════════════════════════════════════
function getReviewIntervals(id){
  const mastery = getTopicMastery(id);
  const dependents = getDependents(id).length;

  // Base según cuántos temas desbloquea
  let base;
  if(dependents >= 3)       base = [2, 4, 8];    // cuello crítico
  else if(dependents >= 1)  base = [3, 6, 12];   // importante
  else                      base = [4, 9, 18];   // hoja, relax

  // Ajuste por dominio real
  if(mastery >= 80)      base = base.map(d => Math.round(d * 1.6));
  else if(mastery < 40)  base = base.map(d => Math.max(1, Math.round(d * 0.6)));

  return base;
}
// ── MEJORA 1: ALERTA DE REVISIÓN ESPACIADA ──
function getSpacedDue(){
  const td=today();
  const dueIds=[];
  for(const[id,data]of Object.entries(S.t||{})){
    if(!data.done||!data.reviewDates)continue;
    const pending=data.reviewDates.filter((d,i)=>d<=td&&!(data.reviewsDone||[]).includes(i));
    if(pending.length>0){
      const t=getTopic(id);
      dueIds.push({id,name:t.name||id,course:t.course||'',pending});
    }
  }
  return dueIds;
}
function renderSpacedReviewAlert(){
  const dueIds=getSpacedDue();
  const panel=document.getElementById('spacedReviewContent');
  const colors={Aritmética:'rgb(56,189,248)',Álgebra:'rgb(251,146,60)',Física:'rgb(236,72,153)',Geometría:'rgb(134,239,172)',Trigonometría:'rgb(167,139,250)',Química:'rgb(34,197,94)'};
  if(panel){
    if(!dueIds.length){
      panel.innerHTML='<span style="color:var(--accent3)">✓ Sin repasos pendientes hoy.</span>';
    }else{
      panel.innerHTML='<span style="display:block;margin-bottom:.35rem"><strong>'+dueIds.length+'</strong> cap'+(dueIds.length>1?'s':'')+' esperando repaso — clic para marcar hecho:</span>'
        +'<div style="display:flex;flex-wrap:wrap;gap:.25rem">'
        +dueIds.map(({id,name,course,pending})=>{
          const col=colors[course]||'#888';
          const label=name.match(/Cap\.\s*\w+/)?.[0]||name.substring(0,14);
          return `<button type="button" onclick="markReviewDone('${id}')" style="cursor:pointer;font-size:.68rem;padding:.2rem .4rem;border:1px solid ${col};color:${col};background:transparent;border-radius:3px">${label} <span style="opacity:.6">${pending[0]}</span> ✓</button>`;
        }).join('')
        +'</div>';
    }
  }
  const legacy=document.getElementById('spacedReviewBox');
  if(legacy)legacy.innerHTML='';
}

function markReviewDone(id){
  if(!S.t||!S.t[id])return;
  const td=today();
  const dates=S.t[id].reviewDates||[];
  if(!S.t[id].reviewsDone)S.t[id].reviewsDone=[];
  dates.forEach((d,i)=>{
    if(d<=td&&!S.t[id].reviewsDone.includes(i))
      S.t[id].reviewsDone.push(i);
  });
  // Schedule next review if all done: add +30d bonus review
  if(S.t[id].reviewsDone.length>=dates.length){
    const next=localKey(new Date(Date.now()+30*86400000));
    if(!dates.includes(next)){
      S.t[id].reviewDates.push(next);
    }
  }
  save();renderSpacedReviewAlert();renderPlanHealth();
  // Flash feedback on the topic item
  const el=document.querySelector('[data-id="'+id+'"]');
  if(el){el.style.transition='background .3s';el.style.background='#0d2e1a';setTimeout(()=>el.style.background='',600);}
}

// ── MEJORA 2: ERRORES POR CAPÍTULO ──
function saveCapError(id,err){
  if(!err.trim())return;
  if(!S.capErrors)S.capErrors={};
  if(!S.capErrors[id])S.capErrors[id]=[];
  if(!S.capErrors[id].includes(err.trim()))
    S.capErrors[id].push(err.trim());
  save();
  renderCapErrors(id);
  // Also add to global error log if new
  if(!S.errors)S.errors=[];
  if(!S.errors.includes(err.trim()))
    S.errors.unshift('['+id+'] '+err.trim());
  renderE();
}
function renderCapErrors(id){
  const el=document.getElementById('caperr-'+id);
  if(!el)return;
  const errs=(S.capErrors||{})[id]||[];
  if(!errs.length){el.innerHTML='';return;}
  el.innerHTML='<div style="font-size:.66rem;color:var(--accent2);margin-top:.2rem">'
    +errs.map((e,i)=>`<span style="margin-right:.3rem">⚠ ${e} <span onclick="delCapError('${id}',${i})" style="cursor:pointer;opacity:.5">✕</span></span>`).join('')
    +'</div>';
}
function delCapError(id,idx){
  if(!S.capErrors||!S.capErrors[id])return;
  S.capErrors[id].splice(idx,1);
  save();renderCapErrors(id);
}
function renderAllCapErrors(){
  document.querySelectorAll('.ti[data-id]').forEach(el=>{
    const id=el.dataset.id;
    renderCapErrors(id);
  });
}

// ── MEJORA 3: PROYECCIÓN DINÁMICA DE RITMO ──
function updateRhythmProjection(){
  const td=today();
  const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);
  if(!aw)return;
  const total=aw.topics.length;
  const done=aw.topics.filter(id=>(S.t||{})[id]?.done).length;
  const remaining=total-done;
  // Avg caps/day last 3 days
  const doneByDay={};
  for(const[id,data]of Object.entries(S.t||{})){
    if(data.done&&data.completedAt){
      const d=localKey(new Date(data.completedAt));
      doneByDay[d]=(doneByDay[d]||0)+1;
    }
  }
  let capsLast3=0;
  for(let i=0;i<3;i++){const d=new Date();d.setDate(d.getDate()-i);capsLast3+=(doneByDay[localKey(d)]||0);}
  const avgRate=capsLast3/3;
  const el=document.getElementById('rhythmProjection');
  if(!el)return;
  if(remaining===0){el.textContent='✓ semana completada';el.style.color='var(--accent3)';return;}
  if(avgRate<=0){el.textContent='sin datos de ritmo aún';el.style.color='var(--muted)';return;}
  const daysNeeded=Math.ceil(remaining/avgRate);
  const finishDate=new Date();finishDate.setDate(finishDate.getDate()+daysNeeded);
  const finishStr=localKey(finishDate);
  const planEnd=aw.e;
  const onTime=finishStr<=planEnd;
  el.textContent='a tu ritmo actual → terminas el '+finishStr+(onTime?' ✓':' ⚠ (meta: '+planEnd+')');
  el.style.color=onTime?'var(--accent3)':'var(--accent2)';
}

// ── MEJORA 4: CONTADOR DE EJERCICIOS ──
function getExGoal(id){

  const d=(S.t||{})[id]?.diff;

  if(d==='p')return 30;

  if(d==='m')return 25;

  return 20;

}

function getExCount(id){return(S.exCount||{})[id]||0;}

function adjEx(id,delta){

  if(!S.exCount)S.exCount={};

  const goal=getExGoal(id);

  const n=Math.max(0,Math.min(goal,getExCount(id)+delta));

  if(n===0)delete S.exCount[id];

  else S.exCount[id]=n;

  lastFocusedTopicId=id;

  save();renderExBadge(id);

}

function setEx(id,value){

  const goal=getExGoal(id);

  const n=Math.max(0,Math.min(goal,Number(value)));

  const current=getExCount(id);

  const delta=n-current;

  if(delta)adjEx(id,delta);

}

function renderExBadge(id){

  const el=document.getElementById('exn-'+id);

  if(!el)return;

  const goal=getExGoal(id);

  const n=getExCount(id);

  el.textContent=n+'/'+goal;

  el.classList.toggle('done',n>=goal);

  el.classList.toggle('low',n>0&&n<15);

  const bar=document.getElementById('exbf-'+id);

  if(bar)bar.style.width=Math.min(100,Math.round(n/goal*100))+'%';

  const slider=document.querySelector('.ti[data-id="'+id+'"] .ex-slider');

  if(slider)slider.value=n;

}

function renderAllExBadges(){

  document.querySelectorAll('.ti[data-id]').forEach(el=>renderExBadge(el.dataset.id));

}

// ── MEJORA 5: MINI-REPASO PRE-OPERACIÓN ──
function renderPreOpReview(){
  const td=today();
  const opWindows=[
    {id:'w4', from:'2026-08-31', to:'2026-09-20', prevWeeks:['w1','w2','w3'], label:'Cirugía catarata PPV (ambos ojos)'},
  ];
  for(const op of opWindows){
    const boxId='preop-'+op.id;
    let box=document.getElementById(boxId);
    if(!box)continue;
    // Only show if we're in the op week or within 2 days before
    const daysUntil=daysBetween(td,op.from);
    if(daysUntil>2||td>op.to){box.style.display='none';continue;}
    box.style.display='block';
    // Find weakest topics from previous weeks
    const prevTopicIds=op.prevWeeks.flatMap(wid=>{
      const w=WSCHED.find(w=>w.id===wid);
      return w?w.topics:[];
    });
    const scored=prevTopicIds.map(id=>{
      const data=(S.t||{})[id]||{};
      
      const errCount=((S.capErrors||{})[id]||[]).length;
      const diff=data.diff==='p'?3:data.diff==='m'?2:1;
      const score=errCount*3+diff+(data.done?0:5);
      const {name,course}=getTopic(id);
      return{id,name,course,score,done:data.done,errCount};
    }).sort((a,b)=>b.score-a.score);
    const top=scored.slice(0,5);
    const colors={Aritmética:'rgb(56,189,248)',Álgebra:'rgb(251,146,60)',Física:'rgb(236,72,153)',Geometría:'rgb(134,239,172)',Trigonometría:'rgb(167,139,250)',Química:'rgb(34,197,94)'};
    box.innerHTML='<div class="alert-box" style="border-color:var(--accent4);background:#2a1a00;flex-direction:column;gap:.3rem">'
      +'<div style="display:flex;align-items:center;gap:.4rem"><div class="alert-dot" style="background:var(--accent4)"></div><strong>🔍 '+op.label+' — repaso sugerido</strong><span style="font-size:.68rem;color:var(--muted)">temas más débiles de semanas previas</span></div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:.25rem">'
      +top.map(({id,name,course,errCount})=>{
        const col=colors[course]||'#888';
        const label=name.match(/Cap\.\s*\w+/)?.[0]||name.substring(0,14);
        return `<span onclick="scrollToTopic('${id}')" style="cursor:pointer;font-size:.68rem;padding:.15rem .4rem;border:1px solid ${col};color:${col};border-radius:3px">${label}${errCount?' ⚠'+errCount:''}</span>`;
      }).join('')
      +'</div></div>';
  }
}

// ── MEJORA 6: ¿QUÉ ESTUDIO AHORA? ──
function whatNext(){
  const td=today();
  const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);
  if(!aw){
    showWhatNext('Estás fuera de semana activa. Revisa el plan manualmente.','var(--muted)');return;
  }
  // Find first undone topic in active week
  const undone=aw.topics.filter(id=>!(S.t||{})[id]?.done);
  if(!undone.length){
    showWhatNext('✓ ¡Completaste Todos los temas de esta semana!','var(--accent3)');return;
  }
  const nextId=undone[0];
  const {name,course}=getTopic(nextId);
  const el=document.querySelector('[data-id="'+nextId+'"]');
  const lum=el?.querySelector('.lum')?.textContent||'';
  // How much time left today?
  const hoy=(S.h||{})[td]||0;
  const mh=aw?getWeekTargetHours(aw.id):6;
  const remaining=Math.max(0,mh*3600-hoy);
  const remStr=remaining>0?fmt(remaining)+' pendientes hoy':'meta de hoy alcanzada';
  const exDone=getExCount(nextId);
  const exGoal=getExGoal(nextId);
  const msg='<strong>'+name+'</strong>'+(lum?' <span style="opacity:.6">'+lum+'</span>':'')
    +'<br><span style="font-size:.68rem;color:var(--muted)">'+course+' · '+remStr+' · '+exDone+'/'+exGoal+' ej · meta caps/día en panel superior</span>';
  lastFocusedTopicId=nextId;
  showWhatNext(msg,'var(--accent3)');
  // Scroll to it
  setTimeout(()=>{if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},300);
}
function showWhatNext(msg,color){
  const box=document.getElementById('whatNextResult');
  if(!box)return;
  box.innerHTML=msg;
  box.style.color=color;
  box.style.opacity='1';
  setTimeout(()=>box.style.opacity='0.7',3000);
}

// ── MEJORA 8: GRÁFICO DE CONSTANCIA (días estudiados vs días totales) ──
function renderConsistencyChart(){
  const el=document.getElementById('consistencyChart');
  if(!el)return;
  if(!S.h)S.h={};
  const today_=today();
  const planStart=PLAN_START;
  const planEnd=PLAN_END;
  const startDate=new Date(planStart+'T00:00:00');
  const endDate=new Date(planEnd+'T00:00:00');
  const todayDate=new Date(today_+'T00:00:00');
  const totalDays=Math.round((endDate-startDate)/86400000)+1;
  const daysPassed=Math.max(0,Math.min(totalDays,Math.round((todayDate-startDate)/86400000)+1));
  let studiedDays=0,missedDays=0;
  const bars=[];
  for(let i=0;i<daysPassed;i++){
    const d=new Date(startDate);d.setDate(d.getDate()+i);
    const k=localKey(d);
    const h=(S.h||{})[k]||0;
    const isOp=OP_WEEKS.some(wid=>{const w=WSCHED.find(w=>w.id===wid);return w&&k>=w.s&&k<=w.e;});
    const isStudy=STUDY_DAYS.includes(d.getDay());
    bars.push({k,h,isOp,isStudy});
    if(h>0)studiedDays++;
    else if(!isOp&&isStudy)missedDays++;
  }
  const eligible=bars.filter(b=>b.isStudy||b.h>0).length;
  const pct=eligible>0?Math.round(studiedDays/eligible*100):0;
  const maxH=Math.max(...bars.map(b=>b.h),1);
  // Render mini bar chart (last 30 days shown)
  const show=bars.slice(-42);
  const barsHtml=show.map(({k,h,isOp,isStudy})=>{
    if(!isStudy&&h===0)return'<div style="width:5px;height:2px;background:var(--border);opacity:.3;flex-shrink:0;border-radius:1px 1px 0 0;align-self:flex-end"></div>';
    const ht=h>0?Math.max(4,Math.round(h/maxH*28)):2;
    const col=isOp?'var(--border)':h>0?(h>=4*3600?'var(--accent3)':h>=2*3600?'var(--accent4)':'#3a5a3a'):'var(--accent2)';
    const op=isOp?0.3:1;
    return'<div title="'+k+': '+(h?fmt(h):'sin estudio')+'" style="width:5px;height:'+ht+'px;background:'+col+';opacity:'+op+';flex-shrink:0;border-radius:1px 1px 0 0;align-self:flex-end"></div>';
  }).join('');
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem">'
    +'<span style="font-size:.72rem;font-weight:600;color:var(--text)">Constancia</span>'
    +'<span style="font-size:.68rem;color:var(--muted)">'+studiedDays+' / '+daysPassed+' días estudiados <strong style="color:'+(pct>=70?'var(--accent3)':pct>=50?'var(--accent4)':'var(--accent2)')+'">'+pct+'%</strong></span>'
    +'</div>'
    +'<div style="display:flex;gap:2px;align-items:flex-end;height:32px;margin-bottom:.25rem;flex-wrap:nowrap;overflow:hidden">'+barsHtml+'</div>'
    +'<div style="display:flex;gap:.5rem;font-size:.64rem;color:var(--muted)">'
    +'<span><span style="color:var(--accent3)">■</span> ≥4h</span>'
    +'<span><span style="color:var(--accent4)">■</span> 2-4h</span>'
    +'<span><span style="color:#3a5a3a">■</span> <2h</span>'
    +'<span><span style="color:var(--accent2)">■</span> sin estudio</span>'
    +'<span style="margin-left:.4rem;opacity:.7">· gris = semana op. (no cuenta como fallo)</span>'
    +'</div>';
}

// ── MEJORA 10: ALERTAS DE SEMANA DE ALTA CARGA ──
const HIGH_LOAD_WEEKS=[
  {id:'w3',label:'Cierre pre-cirugía',threshold:8},
  {id:'w10',label:'Mitad de bloque 2',threshold:8},
  {id:'w15',label:'Cierre bloque 2',threshold:8},
  {id:'w23',label:'Cierre bloque 3',threshold:8},
];
function renderHighLoadAlerts(){
  const td=today();
  const el=document.getElementById('highLoadAlerts');
  if(!el)return;
  const alerts=[];
  for(const hw of HIGH_LOAD_WEEKS){
    const w=WSCHED.find(w=>w.id===hw.id);
    if(!w)continue;
    const daysUntil=daysBetween(td,w.s);
    if(daysUntil>14||daysUntil<0)continue; // only show if within 14 days
    const done=w.topics.filter(id=>(S.t||{})[id]?.done).length;
    alerts.push({...hw,w,daysUntil,done,total:w.topics.length});
  }
  if(!alerts.length){el.innerHTML='';return;}
  el.innerHTML=alerts.map(a=>{
    const urgent=a.daysUntil<=3;
    return'<div class="alert-box" style="border-color:'+(urgent?'var(--accent2)':'var(--accent4)')+';background:'+(urgent?'#2a0a0a':'#2a1a00')+'">'
      +'<div class="alert-dot" style="background:'+(urgent?'var(--accent2)':'var(--accent4)')+'"></div>'
      +'<span>⚠ <strong>Semana pesada en '+a.daysUntil+' día'+(a.daysUntil===1?'':'s')+'</strong> — '+a.label+' ('+a.w.s+', '+a.threshold+'h/día). '
      +a.done+'/'+a.total+' caps ya hechos. Considera adelantar lo que puedas.</span>'
      +'</div>';
  }).join('');
}



// ═══════════════════════════════════════════════════════════════
// MEJORAS v12 — todas las funciones nuevas
// ═══════════════════════════════════════════════════════════════
function getActiveWeek(){
  const td=today();
  return WSCHED.find(w=>td>=w.s&&td<=w.e)||null;
}
function countCapsDoneToday(){
  const td=today();
  let n=0;
  for(const[id,data]of Object.entries(S.t||{})){
    if(data.done&&data.completedAt&&localKey(new Date(data.completedAt))===td)n++;
  }
  return n;
}
function renderDailyCapsGoal(){
  const el=document.getElementById('dailyCapsGoal');
  if(!el)return;
  const aw=getActiveWeek();
  if(!aw){el.textContent='Sin semana activa hoy.';return;}
  if(OP_WEEKS.includes(aw.id)){
    el.innerHTML='🔴 <strong>Semana de recuperación</strong> — sin meta de caps. Prioridad: descanso.';
    return;
  }
  const td=today();
  const total=aw.topics.length;
  const done=aw.topics.filter(id=>(S.t||{})[id]?.done).length;
  const dl=Math.max(1,daysBetween(td,aw.e)+1);
  const need=Math.ceil((total-done)/dl);
  const doneToday=countCapsDoneToday();
  const ok=doneToday>=need;
  el.innerHTML='Hoy toca <strong style="color:'+(ok?'var(--accent3)':'var(--accent2)')+'">'+need+' cap'+(need===1?'':'s')+'</strong> · llevas <strong>'+doneToday+'</strong> · semana <strong>'+done+'/'+total+'</strong>';
}
function renderPlanHealth(){
  const el=document.getElementById('planHealth');
  if(!el)return;
  const all=document.querySelectorAll('.ti[data-id]').length;
  const done=document.querySelectorAll('.ti[data-id].done').length;
  const pct=all?Math.round(done/all*100):0;
  const td=today();
  const planStart=PLAN_START;
  const startDate=new Date(planStart+'T00:00:00');
  const todayDate=new Date(td+'T00:00:00');
  const daysPassed=Math.max(1,Math.round((todayDate-startDate)/86400000)+1);
  let studied=0,eligible=0;
  for(let i=0;i<daysPassed;i++){
    const d=new Date(startDate);d.setDate(d.getDate()+i);
    const k=localKey(d);
    const isOp=OP_WEEKS.some(wid=>{const w=WSCHED.find(w=>w.id===wid);return w&&k>=w.s&&k<=w.e;});
     if(!isOp&&STUDY_DAYS.includes(d.getDay())){eligible++;if((S.h||{})[k]>0)studied++;}
  }
  const consist=eligible?Math.round(studied/eligible*100):0;
  const aw=getActiveWeek();
  let behind=0;
  if(aw&&!OP_WEEKS.includes(aw.id)){
    const rem=aw.topics.filter(id=>!(S.t||{})[id]?.done).length;
    const dl=Math.max(1,daysBetween(td,aw.e)+1);
    const need=Math.ceil(rem/dl);
    const rate=countCapsDoneToday();
    if(rate<need)behind=need-rate;
  }
  const reviews=getSpacedDue().length;
  el.innerHTML=
    '<div class="health-item"><div class="health-val" style="color:var(--accent)">'+pct+'%</div><div class="health-lbl">plan</div></div>'
    +'<div class="health-item"><div class="health-val" style="color:var(--accent3)">'+consist+'%</div><div class="health-lbl">constancia</div></div>'
    +'<div class="health-item"><div class="health-val" style="color:var(--accent4)">'+reviews+'</div><div class="health-lbl">repasos</div></div>'
    +'<div class="health-item"><div class="health-val" style="color:'+(behind>0?'var(--accent2)':'var(--accent3)')+'">'+(behind>0?'-'+behind:'✓')+'</div><div class="health-lbl">caps hoy</div></div>'
    +'<div class="health-item"><div class="health-val">'+((S.errors||[]).length)+'</div><div class="health-lbl">errores</div></div>';
}
function renderYesterdaySummary(){
  const el=document.getElementById('yesterdaySummary');
  if(!el)return;
  const d=new Date();d.setDate(d.getDate()-1);
  const k=localKey(d);
  const h=(S.h||{})[k]||0;
  let caps=0;
  for(const[id,data]of Object.entries(S.t||{})){
    if(data.done&&data.completedAt&&localKey(new Date(data.completedAt))===k)caps++;
  }
  const sessions=(S.sessions||[]).filter(s=>s.date===k);
  const courses=[...new Set(sessions.map(s=>s.course).filter(Boolean))];
  if(!h&&!caps&&!sessions.length){el.textContent='Sin actividad registrada ayer.';return;}
  el.innerHTML=(h?fmt(h)+' estudiadas':'sin horas')
    +' · '+caps+' cap'+(caps===1?'':'s')
    +(courses.length?' · '+courses.join(', '):'')
    +(sessions.length?' · '+sessions.length+' sesión'+(sessions.length===1?'':'es'):'');
}
function filterWeekPending(force){
  if(typeof force==='boolean')weekPendingFilter=force;
  else weekPendingFilter=!weekPendingFilter;
  document.getElementById('vcWeekPending')?.classList.toggle('active',weekPendingFilter);
  const aw=getActiveWeek();
  document.querySelectorAll('.week').forEach(w=>{
    if(!weekPendingFilter){w.classList.remove('print-hide');return;}
    const wid=w.id?.replace('week-','');
    w.classList.toggle('print-hide',!aw||wid!==aw.id);
    if(aw&&wid===aw.id)w.classList.add('ex');
  });
  document.querySelectorAll('.ti[data-id]').forEach(ti=>{
    if(!weekPendingFilter){ti.style.display='';return;}
    const id=ti.dataset.id;
    const inWeek=aw&&aw.topics.includes(id);
    const done=(S.t||{})[id]?.done;
    ti.style.display=(inWeek&&!done)?'':'none';
  });
}
function renderExamChecklist(){
  const panel=document.getElementById('examChecklistPanel');
  const el=document.getElementById('examChecklist');
  const h3=panel?panel.querySelector('h3'):null;
  if(!panel||!el)return;
  const td=today();
  if(td!=='2027-02-13'&&td!=='2027-02-14'){panel.style.display='none';return;}
  panel.style.display='block';
  if(!S.checklist)S.checklist={};
  let items;
  if(td==='2027-02-13'){
    if(h3)h3.textContent='🎯 Checklist día previo (13 feb)';
    items=[
      {k:'quimicaCierre',label:'Química al día — últimos caps (q17–q19)'},
      {k:'simulacro',label:'Último mini-simulacro de errores'},
      {k:'bolsa',label:'Preparar bolsa: DNI, carnet, lápiz, borrador, tajador'},
      {k:'sueño',label:'Dormir temprano — mañana no estudiar nada nuevo'},
    ];
  }else{
    if(h3)h3.textContent='🎯 Checklist pre-examen (14 feb)';
    items=[
      {k:'repasoTop5',label:'Repasar los 5 errores más frecuentes (Stats → mini-sim)'},
      {k:'formulas',label:'Repaso rápido de fórmulas clave (una pasada ligera)'},
      {k:'dormir',label:'Dormir bien — examen mañana lunes 15 feb'},
      {k:'materiales',label:'DNI, carnet, útiles, reloj, agua listos'},
      {k:'relax',label:'Nada de temas nuevos — solo lectura suave'},
    ];
  }
  el.innerHTML=items.map(it=>'<label class="check-item"><input type="checkbox" '+(S.checklist[it.k]?'checked':'')+' onchange="toggleChecklistItem(\''+it.k+'\',this.checked)"><span>'+it.label+'</span></label>').join('');
}
function toggleChecklistItem(k,val){
  if(!S.checklist)S.checklist={};
  S.checklist[k]=val;save();
}
function addSimLogEntry(){
  const dateEl=document.getElementById('simLogDate');
  const typeEl=document.getElementById('simLogType');
  const scoreEl=document.getElementById('simLogScore');
  const failsEl=document.getElementById('simLogFails');
  const date=dateEl?.value||today();
  const type=typeEl?.value||'Mixto';
  const score=parseInt(scoreEl?.value,10);
  const fails=(failsEl?.value||'').split(',').map(s=>s.trim()).filter(Boolean);
  if(isNaN(score)){showToast('Ingresa una nota válida (0-100)');return;}
  if(!S.simLog)S.simLog=[];
  S.simLog.unshift({date,type,score,fails,ts:Date.now()});
  if(S.simLog.length>50)S.simLog=S.simLog.slice(0,50);
  fails.forEach(desc=>{
    if(!S.errors)S.errors=[];
    const msg='[Sim '+date+'] '+desc;
    if(!S.errors.includes(msg))S.errors.unshift(msg);
    if(!S.bank)S.bank=[];
    S.bank.unshift({date,course:type,tema:'Simulacro',prob:desc,sol:''});
  });
  if(scoreEl)scoreEl.value='';
  if(failsEl)failsEl.value='';
  save();renderSimLog();renderE();renderBank();
}
function renderSimLog(){
  const el=document.getElementById('simLogList');
  if(!el)return;
  const logs=S.simLog||[];
  if(!logs.length){el.innerHTML='<div style="color:var(--muted);font-size:.72rem">Sin simulacros registrados.</div>';return;}
  el.innerHTML=logs.map((log,i)=>'<div class="sim-log-row"><span>'+log.date+'</span><span style="color:var(--accent4)">'+log.type+'</span><strong>'+log.score+'/100</strong>'
    +(log.fails?.length?'<span style="color:var(--muted)">fallos: '+log.fails.join('; ')+'</span>':'')
    +'<span class="bank-del" style="margin-left:auto" onclick="delSimLog('+i+')">✕</span></div>').join('');
}
function delSimLog(i){if(!S.simLog)return;S.simLog.splice(i,1);save();renderSimLog();}
function generateMiniSimFromErrors(){
  const errs=(S.errors||[]).slice(0,8);
  const heavy=[];
  for(const [id,data] of Object.entries(S.t||{})){
    if(data.diff==='p'&&TOPIC_INDEX[id]){
      const n=TOPIC_INDEX[id].name;
      if(!heavy.includes(n))heavy.push(n);
    }
  }
  const pool=[...errs.map(e=>'Error: '+e),...heavy.map(n=>'Repasar cap pesado: '+n)];
  if(!pool.length){showToast('No hay errores ni caps pesados para generar mini-sim.');return;}
  const n=Math.min(8,pool.length);
  const picked=[];
  const copy=pool.slice();
  for(let i=0;i<n;i++){const j=Math.floor(Math.random()*copy.length);picked.push(copy.splice(j,1)[0]);}
  const el=document.getElementById('examGenResult');
  if(el){
    showView('bank',null);
    el.innerHTML='<div style="margin-top:.5rem"><strong>Mini-simulacro ('+n+' ítems)</strong><ol style="margin:.4rem 0 0 1rem;font-size:.72rem">'+picked.map((p,i)=>'<li style="margin:.2rem 0">'+p+'</li>').join('')+'</ol></div>';
  }else showToast(picked.join('\n'));
}
function printActiveWeek(){
  const aw=getActiveWeek();
  if(!aw){showToast('No hay semana activa.');return;}
  const wasPendingFilter=weekPendingFilter;
  document.querySelectorAll('.week').forEach(w=>{
    const isActive=w.id==='week-'+aw.id;
    w.classList.toggle('print-hide',!isActive);
    w.classList.toggle('print-active',isActive);
    if(isActive)w.classList.add('ex');
  });
  document.body.classList.add('print-week');
  window.print();
  setTimeout(()=>{
    document.body.classList.remove('print-week');
    document.querySelectorAll('.print-hide,.print-active').forEach(el=>el.classList.remove('print-hide','print-active'));
    if(wasPendingFilter){
      weekPendingFilter=true;
      filterWeekPending(true);
    }else{
      document.querySelectorAll('.ti[data-id]').forEach(ti=>ti.style.display='');
    }
  },800);
}
function renderSyncHint(){
  const el=document.getElementById('cfgSyncHint');
  if(el){
    const t=S._savedAt?new Date(S._savedAt).toLocaleString('es-PE'):'nunca';
    el.textContent='Último guardado local: '+t;
  }
}
function toggleFab(){document.getElementById('fabWrap')?.classList.toggle('open');}
function fabAction(kind){
  document.getElementById('fabWrap')?.classList.remove('open');
  const id=lastFocusedTopicId||getActiveWeek()?.topics?.find(t=>!(S.t||{})[t]?.done);
  if(!id){whatNext();return;}
  if(kind==='ex')adjEx(id,1);
  else if(kind==='cap'){
    const el=document.querySelector('[data-id="'+id+'"] .tck');
    if(el)ck({stopPropagation:()=>{}},id);
  }
}
function renderEnhancements(){
  renderDailyCapsGoal();
  renderPlanHealth();
  renderYesterdaySummary();
  renderSpacedReviewAlert();
  renderSimLog();
  renderSyncHint();
  const dateEl=document.getElementById('simLogDate');
  if(dateEl&&!dateEl.value)dateEl.value=today();
}
function initPWA(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('Plan_UNI_sw.js').catch(()=>{});
  }
}

// v10: toggle cap error form
function toggleCapErr(id){
  const presetWrap=document.getElementById('cap-epreset-'+id);
  const customWrap=document.getElementById('tierradd-'+id);
  const course=getTopic(id).course;
  if(presetWrap){
    const showing=presetWrap.style.display!=='none'&&presetWrap.innerHTML!=='';
    if(showing){
      presetWrap.style.display='none';
      if(customWrap)customWrap.style.display='none';
    }else{
      presetWrap.style.display='flex';
      renderCapErrPresets(id,course);
      if(customWrap)customWrap.style.display='none';
    }
  }
  lastFocusedTopicId=id;
}


// ═══════════════════════════════════════════════════════════════
// HOME DASHBOARD v13
// ═══════════════════════════════════════════════════════════════

function renderHome(){
  renderHomeSubtitle();
  renderHomeAccion();
  renderHomeCapActual();
  renderHomePendienteHoy();
  renderHomeProgSem();
  renderHomeErrores();
  renderHomeFlashcards();
  renderHomeDiffPending();
  renderHomeSimRec();
  renderHomeErrCurso();
  renderHomeErrCapActual();
  renderHomeErrRecientes();
  renderHomeWeeklyProgress();
  renderHomeNotes();
  const el=document.getElementById('homeLastUpdate');
  if(el)el.textContent='Actualizado: '+new Date().toLocaleTimeString('es-PE');
}

function renderHomeSubtitle(){
  const td=today();
  const rem=Math.max(0,Math.ceil(daysBetween(td,EXAM_DATE)/7));
  const el=document.getElementById('home-subtitle');
  if(el)el.textContent='Hoy: '+td+' · '+rem+' semanas para el examen UNI ('+EXAM_DATE+')';
}

function renderHomeAccion(){
  const aw=getActiveWeek();
  const box=document.getElementById('homeAccionBox');
  const el=document.getElementById('homeAccion');
  const sub=document.getElementById('homeAccionSub');
  if(!el||!sub)return;
  if(!aw){
    el.textContent='Sin semana activa hoy.';
    sub.textContent='Revisa el plan semanal.';
    return;
  }
  if(OP_WEEKS.includes(aw.id)){
    el.textContent='Semana de recuperación 🔴';
    sub.textContent='Prioridad: descanso y repaso ligero. No hay caps nuevos.';
    return;
  }
  const td=today();
  const pending=aw.topics.filter(id=>!(S.t||{})[id]?.done);
  if(!pending.length){
    el.textContent='✓ Semana completada — ¡excelente!';
    sub.textContent='Puedes adelantar caps de la próxima semana o hacer repaso.';
    return;
  }
  const nextId=pending[0];
  const {name:topicName, course}=getTopic(nextId);
  // Fallback si no está en el índice
  const done=aw.topics.filter(id=>(S.t||{})[id]?.done).length;
  const total=aw.topics.length;
  const dl=Math.max(1,daysBetween(td,aw.e)+1);
  const need=Math.ceil((total-done)/dl);
  el.textContent='Continuar: '+topicName;
  sub.textContent=course+' · Faltan '+pending.length+' caps · Meta hoy: '+need+' cap'+(need===1?'':'s');
}
function timeToMinByRow(rowIdx,timeStr){
  const parts=timeStr.split(':');
  const h=Number(parts[0]),m=Number(parts[1]);
  let hh=h;
  if(rowIdx<=5) hh=h;
  else if(rowIdx===6) hh=12;
  else if(rowIdx>=7&&rowIdx<=16) hh=h+12;
  else if(rowIdx===17) hh=23;
  return hh*60+m;
}
function getCurrentScheduleTopic(){
  const now=new Date();
  const ds=localKey(now);
  const info=scheduleWeekFor(ds);
  if(!info)return null;
  const template=getSchedTpl(info.template==='impar'?'odd':'even');
  const dow=(now.getDay()+6)%7;
  if(dow===6)return null;
  const nowMin=now.getHours()*60+now.getMinutes();
  const mins=SCHEDULE_TIMES.map((t,i)=>timeToMinByRow(i,t));
  let row=-1;
  for(let i=0;i<mins.length;i++){if(mins[i]<=nowMin)row=i;else break;}
  if(row<0)return null;
  const blockLabel=template[row][dow];
  if(!blockLabel)return null;
  const s=blockLabel.toLowerCase();
  if(blockLabel===REST||blockLabel==='Dormir'||s.includes('descanso'))return null;
  let course=null;
  if(s.includes('física'))course='Física';
  else if(s.includes('geometr'))course='Geometría';
  else if(s.includes('química'))course='Química';
  else if(s.includes('trigo'))course='Trigonometría';
  else if(s.includes('álgebra'))course='Álgebra';
  else if(s.includes('aritmética'))course='Aritmética';
  else if(blockLabel==='RM')course='Raz. Matemático';
  else if(blockLabel==='RV')course='Raz. Verbal';
  else if(s.includes('historia del perú'))course='Historia del Perú';
  else if(s.includes('historia universal'))course='Historia Universal';
  else if(s.includes('economia')||s.includes('economía'))course='Economía';
  else if(s.includes('literatura'))course='Literatura';
  else if(s.includes('lenguaje'))course='Lenguaje';
  else if(s.includes('geografia')||s.includes('geografía'))course='Geografía';
  else if(s.includes('filosofía')||s.includes('filosofia'))course='Filosofía';
  else if(s.includes('inglés')||s.includes('ingles'))course='Inglés';
  else if(s.includes('psicolog'))course='Psicología';
  return {course,blockLabel,time:SCHEDULE_TIMES[row],dow,row};
}
function renderHomeCapActual(){
  const el=document.getElementById('homeCapActual');
  const sub=document.getElementById('homeCursoActual');
  if(!el||!sub)return;
  const aw=getActiveWeek();
  const current=getCurrentScheduleTopic();
    // Semana de cirugía / descanso
  if(aw && OP_WEEKS.includes(aw.id)){
    el.textContent='Descanso 🏥';
    el.style.color='var(--accent2)';
    const special=PLAN_SPECIAL_WEEKS[parseInt(aw.id.replace('w',''))];
    sub.textContent=special ? special.badge : 'Semana sin temas nuevos';
    return;
  }

  // 1) Si hay bloque en el horario ahora, úsalo
  if(current && current.course && aw){
    const topicId=aw.topics.find(id=>{
      return getTopic(id).course===current.course && !(S.t||{})[id]?.done;
    });
    if(topicId){
      const info=findTopicInfo(topicId);
      el.textContent=info.tema;
      sub.textContent=info.curso+' · ahora: '+current.blockLabel+' ('+current.time+')';
      return;
    }
    el.textContent=current.blockLabel;
    sub.textContent='Ahora: '+current.time+' · sin caps pendientes de '+current.course;
    return;
  }

  // 2) Fallback: primer capítulo pendiente de la semana
  if(!aw){el.textContent='—';sub.textContent='Sin semana activa';return;}
  const pending=aw.topics.filter(id=>!(S.t||{})[id]?.done);
  if(!pending.length){el.textContent='Semana ✓';sub.textContent='Todos los caps completados.';return;}
  const id=pending[0];
  const info=findTopicInfo(id);
  el.textContent=info.tema;
  sub.textContent=info.curso+' · Semana '+aw.id+' ('+aw.s+' – '+aw.e+')';
}

function renderHomePendienteHoy(){
  const td=today();
  const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);
  const el=document.getElementById('homePendienteHoy');
  const sub=document.getElementById('homePendienteHoySub');
  if(!el||!sub)return;

  // Semana de cirugía / descanso → no mostrar "meta cumplida"
  if(aw && OP_WEEKS.includes(aw.id)){
    el.textContent='Descanso 🏥';
    el.className='hc-val';
    el.style.color='var(--accent2)';
    const special=PLAN_SPECIAL_WEEKS[parseInt(aw.id.replace('w',''))];
    sub.textContent=special ? special.desc : 'Semana sin temas programados. Prioridad: recuperación.';
    return;
  }

  const mh=aw?getWeekTargetHours(aw.id):6;
  const ms=mh*3600;
  const hoy=(S.h||{})[td]||0;
  const diff=ms-hoy;

  if(diff<=0){
    el.textContent='¡Meta cumplida!';el.className='hc-val green';
    sub.textContent='Llevas '+fmt(hoy)+' hoy · meta '+mh+'h/día';
    return;
  }
  const h=Math.floor(diff/3600),m=Math.floor((diff%3600)/60);
  el.textContent=h+'h '+m+'m';el.className='hc-val orange';

  const dow=(new Date().getDay()+6)%7; // 0=lun ... 6=dom

  // Antes del miércoles: solo horas, sin veredicto
  if(dow<2){
    sub.textContent='Llevas '+fmt(hoy)+' hoy · meta '+mh+'h/día';
    return;
  }

  const CRASH_WEEKS=['w4','w5','w6']; // semanas de cirugía
  const isExcluded = (ds)=>{
    const w = WSCHED.find(x=>ds>=x.s&&ds<=x.e);
    if(!w) return true;
    if(OP_WEEKS.includes(w.id)) return true;
    if(CRASH_WEEKS.includes(w.id)) return true;
    return false;
  };

  // Ventana: lunes de esta semana hasta ayer, sin domingos
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - dow);
  let secs=0, diasEfectivos=0;
  for(let i=0; i<dow; i++){ // i=0 es lunes; llega hasta ayer
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    if(d.getDay()===0) continue;              // domingo fuera
    const ds = localKey(d);
    if(isExcluded(ds)) continue;              // op-week / cirugía fuera
    diasEfectivos++;
    secs += (S.h||{})[ds]||0;                 // definición A: cuenta aunque sea 0
  }

  const ritmoReal = diasEfectivos>0 ? secs/diasEfectivos : 0;

  // Horas que faltan para el objetivo semanal
  const weekTotal = (S.h||{})['w'+wkey()]||0;
  const weekRemaining = Math.max(0, ms - weekTotal);

  // Días restantes: de hoy a sábado inclusive, menos domingos
  let diasRestantes=0;
  for(let i=0; i<=(6-dow); i++){
    const d=new Date(); d.setDate(d.getDate()+i);
    if(d.getDay()===0) continue;
    const ds = localKey(d);
    if(isExcluded(ds)) continue;
    diasRestantes++;
  }

  const necesario = diasRestantes>0 ? weekRemaining/diasRestantes : weekRemaining;

  let ratio = 1;
  if(necesario>0 && ritmoReal>0) ratio = ritmoReal/necesario;
  else if(necesario>0 && ritmoReal===0) ratio = 0;
  else ratio = 1;

  let vlabel, vcolor;
  if(ratio>=1){vlabel='✓ ritmo viable';vcolor='var(--accent3)';}
  else if(ratio>=0.6){vlabel='⚠ ritmo justo ('+Math.round(ratio*100)+'%)';vcolor='var(--accent4)';}
  else{vlabel='✗ no cierra a este ritmo ('+Math.round(ratio*100)+'%)';vcolor='var(--accent2)';}

  sub.innerHTML='Llevas '+fmt(hoy)+' hoy · meta '+mh+'h/día<br>'
    +'Ritmo real: <strong>'+fmt(Math.round(ritmoReal))+'</strong>/día · necesario: <strong>'+fmt(Math.round(necesario))+'</strong>/día<br>'
    +'<span style="color:'+vcolor+';font-weight:700">'+vlabel+'</span>';
}

function renderHomeProgSem(){
  const aw=getActiveWeek();
  const el=document.getElementById('homeProgSem');
  const sub=document.getElementById('homeProgSemSub');
  if(!el||!sub||!aw)return;

  // Semana de cirugía / descanso
  if(OP_WEEKS.includes(aw.id)){
    el.textContent='—';
    el.className='hc-val';
    el.style.color='var(--accent2)';
    sub.textContent='Semana sin temas · '+aw.id;
    return;
  }

  const done=aw.topics.filter(id=>(S.t||{})[id]?.done).length;
  const total=aw.topics.length;
  const pct=total?Math.round(done/total*100):0;
  el.textContent=done+'/'+total;
  el.className='hc-val green';
  el.style.color='';
  sub.textContent=pct+'% completado · Semana '+aw.id;
}

function renderHomeErrores(){
  const errs=S.errors||[];
  const el=document.getElementById('homeErrTotal');
  const sub=document.getElementById('homeErrSub');
  if(!el||!sub)return;
  el.textContent=errs.length;
  if(!errs.length){sub.textContent='¡Sin errores registrados!';}
  else{
    // group by course tag
    const byCourse={};
    errs.forEach(e=>{
      const match=e.match(/^\[([a-z]+\d*)\]/);
            if(match){
        const id=match[1];
        const course=getTopic(id).course||'Otros';
        byCourse[course]=(byCourse[course]||0)+1;
      }else{
        byCourse['General']=(byCourse['General']||0)+1;
      }
    });
    const top=Object.entries(byCourse).sort((a,b)=>b[1]-a[1]).slice(0,2);
    sub.textContent=top.map(([c,n])=>c+': '+n).join(' · ');
  }
}

function renderHomeFlashcards(){
  const fc=S.fc||[];
  const el=document.getElementById('homeFCTotal');
  const sub=document.getElementById('homeFCSub');
  if(!el||!sub)return;
  if(!fc.length){
    el.textContent='0';
    sub.textContent='Sin tarjetas creadas aún.';
    return;
  }
  const t=today();
  if(!S.fcConfig)S.fcConfig={newPerDay:20,reviewPerDay:200};
  if(!S.fcToday||S.fcToday.date!==t)S.fcToday={date:t,newDone:0,reviewDone:0};
  const due=fc.filter(c=>(c.due||t)<=t).length;
  el.textContent=due;
  if(due===0){
    el.className='hc-val green';
    sub.textContent='✓ Todo al día · '+fc.length+' totales';
  }else{
    el.className='hc-val accent';
    const newRemaining=Math.max(0,S.fcConfig.newPerDay-S.fcToday.newDone);
    const reviewRemaining=Math.max(0,S.fcConfig.reviewPerDay-S.fcToday.reviewDone);
    sub.textContent=newRemaining+' nuevas + '+reviewRemaining+' repaso disponibles';
  }
}


function renderHomeDiffPending(){
  const el=document.getElementById('homeDiffPending');
  const sub=document.getElementById('homeDiffSub');
  if(!el||!sub)return;
  let hard=[];
  document.querySelectorAll('.ti[data-id]').forEach(ti=>{
    const id=ti.dataset.id;
    const data=(S.t||{})[id]||{};
    if(data.diff==='p'&&!data.done){const t=getTopic(id);hard.push({id,name:t.name,course:t.course});}
  });
  el.textContent=hard.length;
  if(!hard.length){el.className='hc-val green';sub.textContent='¡Sin caps pesados pendientes!';}
  else{
    el.className='hc-val orange';
    const byC={};
    hard.forEach(h=>{byC[h.course]=(byC[h.course]||0)+1;});
    sub.textContent=Object.entries(byC).map(([c,n])=>c+': '+n).join(' · ');
  }
}

function renderHomeSimRec(){
  const el=document.getElementById('homeSimRec');
  const sub=document.getElementById('homeSimRecSub');
  if(!el||!sub)return;
  const errs=S.errors||[];
  const bank=S.bank||[];
  const logs=S.simLog||[];
  if(!errs.length&&!bank.length){
    el.textContent='Sin datos suficientes aún.';
    sub.textContent='Registra errores y problemas en el banco para generar simulacros.';
    return;
  }
  const lastSim=logs[0];
  if(lastSim){
    const days=daysBetween(lastSim.date,today());
    if(days<3){
      el.textContent='✓ Simulacro reciente (hace '+days+'d)';
      sub.textContent='Tipo: '+lastSim.type+' · Nota: '+lastSim.score+'/100. Próximo sim en '+(3-days)+' día(s).';
      return;
    }
  }
  if(errs.length>=5){
    el.textContent='Mini-simulacro de errores recomendado';
    sub.textContent=errs.length+' errores activos disponibles. Usa el generador en Banco de problemas.';
  }else{
    el.textContent='Simulacro de banco recomendado';
    sub.textContent=bank.length+' problemas en el banco. Genera un examen aleatorio.';
  }
}

function renderHomeErrCurso(){
  const el=document.getElementById('homeErrCursoGrid');
  const total=document.getElementById('homeErrCursoTotal');
  if(!el)return;
  const errs=S.errors||[];
  const capErrs=S.capErrors||{};
  const COURSE_COLORS={
    'Aritmética':'var(--ca)','Álgebra':'var(--calg)','Física':'var(--cf)',
    'Geometría':'var(--cg)','Trigonometría':'var(--ct)','Química':'var(--cq)',
    'Raz. Matemático':'var(--crm)','Raz. Verbal':'var(--crv)',
    'Historia Universal':'var(--chu)','Historia del Perú':'var(--chp)',
    'Geografía':'var(--cge)','Filosofía':'var(--cfi)',
    'Literatura':'var(--cli)','Lenguaje':'var(--cle)','Inglés':'var(--cin)',
    'Economía':'var(--crm)','Psicología':'var(--cfi)'
  };
  // Fuente de verdad: TOPICS (Todos los cursos reales del plan)
  const courseNames=Object.keys(TOPICS);
  const byCourse={};
  courseNames.forEach(n=>byCourse[n]=0);
  // 1) capErrors (id → curso)
  Object.entries(capErrs).forEach(([id,arr])=>{
    if(!arr||!arr.length)return;
    const c=getTopic(id).course||null;
    if(c&&byCourse[c]!==undefined)byCourse[c]+=arr.length;
  });
  // 2) errores con [id] (capítulo)
  errs.forEach(e=>{
    const match=e.match(/^\[([a-z]+\d*)\]/);
    if(!match)return;
    const id=match[1];
      const c=getTopic(id).course||null;
    if(c&&byCourse[c]!==undefined&&capErrs[id]===undefined)byCourse[c]++;
  });
  // 3) errores con [Curso]
  errs.forEach(e=>{
    const match=e.match(/^\[([A-Za-záéíóúÁÉÍÓÚñÑ.\s]+)\]\s*/);
    if(!match)return;
    const c=match[1].trim();
    if(byCourse[c]!==undefined)byCourse[c]++;
  });
  // 4) Errores totalmente generales (sin prefijo)
  const generalCount=errs.filter(e=>!e.match(/^\[/)).length;
  const totalErrs=Object.values(byCourse).reduce((a,b)=>a+b,0)+generalCount;
  if(total)total.textContent='('+totalErrs+' total)';
  let html=courseNames.map(name=>{
    const n=byCourse[name]||0;
    const col=COURSE_COLORS[name]||'#888';
    const hasErr=n>0;
    const bg=hasErr?'background:#1a0f0f;border-color:#3a1515':'background:#0d1a0f;border-color:#1a3a20';
    return'<div class="ecc" onclick="goToErrCourse(\''+name+'\')" title="'+(hasErr?'Ver errores de '+name:'Sin errores en '+name)+'" style="'+bg+'">'
      +'<div class="ecc-name" style="color:'+col+'">'+courseLabel(name)+'</div>'
      +(hasErr
        ?'<div class="ecc-num">'+n+'</div><div style="font-size:.64rem;color:var(--muted)">err activos</div>'
        :'<div class="ecc-zero">✓</div>')
      +'</div>';
  }).join('');
  // Fila extra para errores generales (sin curso)
  if(generalCount>0){
    html+='<div class="ecc" onclick="goToErrCourse(\'General\')" title="Errores sin curso asignado" style="background:#1a1a0f;border-color:#3a3a15">'
      +'<div class="ecc-name" style="color:var(--muted)">General</div>'
      +'<div class="ecc-num" style="color:var(--accent4)">'+generalCount+'</div>'
      +'<div style="font-size:.64rem;color:var(--muted)">err sin curso</div>'
      +'</div>';
  }
  el.innerHTML=html;
  renderMath(el);
}

function goToErrCourse(course){
  showView('stats',document.querySelector('.sb-btn[onclick*=stats]'));
  setTimeout(()=>{
    const errSection=document.getElementById('elist');
    if(errSection)errSection.scrollIntoView({behavior:'smooth',block:'center'});
  },200);
}

function renderHomeErrCapActual(){
  const el=document.getElementById('homeErrCapActual');
  if(!el)return;
  const aw=getActiveWeek();
  if(!aw){el.textContent='Sin semana activa.';return;}
  const pending=aw.topics.filter(id=>!(S.t||{})[id]?.done);
  if(!pending.length){el.innerHTML='<span style="color:var(--accent3)">✓ Sin caps pendientes esta semana.</span>';return;}
  const currentId=pending[0];
  const capErrs=(S.capErrors||{})[currentId]||[];
  const name=getTopic(currentId).name||currentId;
  if(!capErrs.length){
    el.innerHTML='<span style="color:var(--accent3)">✓ Sin errores registrados en <strong>'+name+'</strong>.</span>';
    return;
  }
  el.innerHTML='<div style="margin-bottom:.25rem;color:var(--text);font-size:.70rem"><strong>'+name+'</strong> — '+capErrs.length+' error'+(capErrs.length===1?'':'es')+':</div>'
    +capErrs.map(e=>'<span style="display:inline-block;font-size:.68rem;padding:.1rem .3rem;background:#2a0f0f;border:1px solid #5a1a1a;color:var(--accent2);margin:.08rem .1rem">⚠ '+e+'</span>').join('');
}

function renderHomeErrRecientes(){
  const el=document.getElementById('homeErrRecientes');
  if(!el)return;
  const errs=S.errors||[];
  if(!errs.length){el.innerHTML='<div style="font-size:.72rem;color:var(--muted)">Sin errores aún.</div>';return;}
  const COURSE_COLORS={Aritmética:'var(--ca)',Álgebra:'var(--calg)',Física:'var(--cf)',Geometría:'var(--cg)',Trigonometría:'var(--ct)',Química:'var(--cq)',Economía:'var(--crm)',Psicología:'var(--cfi)'};
    el.innerHTML=errs.slice(0,5).map(e=>{
    const match=e.match(/^\[([a-z]+\d*)\]/);
    const courseMatch=e.match(/^\[([A-Za-záéíóúÁÉÍÓÚñÑ\s]+)\]\s*/);
    let courseTag='';
    let displayText=e;
    if(match){
      const id=match[1];
      const course=getTopic(id).course||'';
      const col=COURSE_COLORS[course]||'#888';
      if(course)courseTag='<span class="err-recent-course-tag" style="color:'+col+';border-color:'+col+'30;background:'+col+'15">'+course+'</span>';
      displayText=e.replace(/^\[[^\]]+\]\s*/,'');
    }else if(courseMatch){
      const course=courseMatch[1];
      const col=COURSE_COLORS[course]||'#888';
      courseTag='<span class="err-recent-course-tag" style="color:'+col+';border-color:'+col+'30;background:'+col+'15">'+course+'</span>';
      displayText=e.replace(/^\[[^\]]+\]\s*/,'');
    }
    return'<div class="err-recent-item"><div class="err-recent-dot"></div>'+courseTag+'<span>'+displayText+'</span></div>';
  }).join('');
}

function renderHomeWeeklyProgress(){
  const el=document.getElementById('homeWeeklyProgress');
  if(!el)return;
  const COURSE_COLORS={
    'Aritmética':'var(--ca)','Álgebra':'var(--calg)','Física':'var(--cf)',
    'Geometría':'var(--cg)','Trigonometría':'var(--ct)','Química':'var(--cq)',
    'Raz. Matemático':'var(--crm)','Raz. Verbal':'var(--crv)',
    'Historia Universal':'var(--chu)','Historia del Perú':'var(--chp)',
    'Geografía':'var(--cge)','Filosofía':'var(--cfi)',
    'Literatura':'var(--cli)','Lenguaje':'var(--cle)','Inglés':'var(--cin)',
    'Economía':'var(--crm)','Psicología':'var(--cfi)'
  };
  const SCIENCE=['Aritmética','Álgebra','Física','Geometría','Trigonometría','Química'];
  const courses=Object.keys(TOPICS).filter(c=>COURSE_COLORS[c]);
  const sciences=courses.filter(c=>SCIENCE.includes(c));
  const letras=courses.filter(c=>!SCIENCE.includes(c));
  const renderBlock=(list)=>{
    return list.map(name=>{
      const ids=Object.keys(TOPICS[name]||{});
      const total=ids.length;
      const done=ids.filter(id=>(S.t||{})[id]?.done).length;
      const pct=total?Math.round(done/total*100):0;
      const col=COURSE_COLORS[name]||'var(--accent)';
      return'<div class="week-prog-row">'
        +'<div class="wpr-label" style="color:'+col+'">'+courseLabel(name)+'</div>'
        +'<div class="wpr-bar"><div class="wpr-fill" style="width:'+pct+'%;background:'+col+'"></div></div>'
        +'<div class="wpr-pct">'+done+'/'+total+'</div>'
        +'</div>';
    }).join('');
  };
  el.innerHTML='<div style="font-size:.66rem;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:.3rem 0 .3rem">Ciencias</div>'
    +renderBlock(sciences)
    +'<div style="font-size:.66rem;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:.7rem 0 .3rem">Humanidades</div>'
    +renderBlock(letras);
}

function saveHomeNotes(){
  const el=document.getElementById('homeQuickNotes');
  if(!el)return;
  S.homeNotes=el.value;
  save();
}
function renderHomeNotes(){
  const el=document.getElementById('homeQuickNotes');
  if(!el)return;
  el.value=S.homeNotes||'';
}



// ── RENDER ALL ──
function renderAll(){renderPlanTopics();
  renderT();prog();ls();renderH();renderE();renderSim();renderWS();renderHeatmap();renderPrediction();updateSidebar();detectWeek();updateRhythm();
  if(S.globalNotes)document.getElementById('globalNotes').value=S.globalNotes;
  renderBank();renderFC();renderTopicTimes();
  renderAllCapErrors();
  renderAllExBadges();
  renderAllTopicSpeeds();
  renderPreOpReview();
  updateRhythmProjection();
  renderHighLoadAlerts();
  renderEnhancements();
  renderSpeedStats();
  if(document.getElementById('view-home')?.classList.contains('active'))renderHome();
  if(document.getElementById('view-stats')?.classList.contains('active'))renderStats();
  if(document.getElementById('view-sessions')?.classList.contains('active'))renderSessions();
  if(document.getElementById('view-calendar')?.classList.contains('active'))renderCalendar();
  renderContinueStudyButton();
}



// ── FASE 1: MOTOR IA + PRESETS + INTEGRACIÓN GEMINI ──

// Función para convertir markdown básico a HTML
function markdownToHTML(text){
  if(!text)return '';
  let html=text;
  // Convertir **texto** a <strong>texto</strong>
  html=html.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  // Convertir *texto* a <em>texto</em>
  html=html.replace(/\*(.*?)\*/g,'<em>$1</em>');
  // Convertir __texto__ a <strong>texto</strong>
  html=html.replace(/__(.*?)__/g,'<strong>$1</strong>');
  // Convertir _texto_ a <em>texto</em>
  html=html.replace(/_(.*?)_/g,'<em>$1</em>');
  // Convertir `texto` a <code>texto</code>
  html=html.replace(/`(.*?)`/g,'<code>$1</code>');
  return html;
}

// Configuración de API Key (Groq)
const GROQ_API_KEY_KEY='uni-groq-api-key';
function getGroqApiKey(){return localStorage.getItem(GROQ_API_KEY_KEY)||'';}
function setGroqApiKey(key){localStorage.setItem(GROQ_API_KEY_KEY,key.trim());}
function hasGroqApiKey(){return !!getGroqApiKey();}

// Sistema de Presets de Prompts
const PromptPresets = {
  systemPrompt: `Eres un profesor especialista en preparación para el examen de admisión de la Universidad Nacional de Ingeniería (UNI).

Genera únicamente contenido en texto plano. Prohibido generar o mencionar imágenes.

REGLA CRÍTICA DE CONSISTENCIA MATEMÁTICA:

Para cada ejercicio debes seguir este flujo interno obligatorio:

1. Primero resuelve completamente el problema y obtén un resultado final único y exacto.
2. Ese resultado queda FIJO e INMUTABLE (no se puede modificar después).
3. Construye el enunciado del problema usando ese resultado ya fijado.
4. Genera 5 alternativas (A, B, C, D, E) donde solo una sea correcta.
5. Las alternativas incorrectas deben ser errores plausibles de estudiantes.
6. Verifica una sola vez que la respuesta correcta coincide con el resultado fijado.
7. Si hay inconsistencia, descarta el ejercicio completo y genera uno nuevo.

REGLAS IMPORTANTES:
- No rehagas ni ajustes el problema después de generar alternativas.
- No cambies el resultado final para hacerlo encajar con opciones.
- Mantén coherencia total entre enunciado, solución y alternativas.
`,

presets: {
  teoria: `Actúa como profesor de {curso} para el examen de admisión UNI.

Explicá el tema "{tema}" con profundidad {dificultad} (baja=concepto, media=concepto+aplicación, alta=concepto+aplicación+caso límite o excepción).

ESTRUCTURA OBLIGATORIA:
1. Idea central del tema (2-3 líneas, sin vueltas).
2. Propiedades/fórmulas con condición de aplicación (cuándo SÍ y cuándo NO usarlas).
3. Un ejemplo resuelto paso a paso.
4. Un error típico de estudiantes y cómo evitarlo.

REGLAS:
- Prohibido usar analogías vagas ("es como...").
- Prohibido relleno motivacional.
- Solo texto plano con notación matemática clara (usa \\( \\) para fórmulas inline, $$ para bloque).`,

  preguntas_conceptuales: `Actúa como profesor de {curso} nivel UNI.

Generá {cantidad} preguntas conceptuales sobre "{tema}", dificultad {dificultad}.

DEFINICIÓN OPERATIVA DE DIFICULTAD:
- baja: reconocer una definición o propiedad directa.
- media: comparar dos propiedades o elegir cuál aplica.
- alta: identificar la propiedad que NO aplica en un caso dado, o distinguir dos propiedades que los estudiantes suelen confundir.

REGLAS DE CALIDAD:
- Cada pregunta debe apuntar a UN concepto específico. Prohibido preguntar cosas que se resuelven "por sentido común" sin conocer el tema.
- Al menos una pregunta debe usar un contraejemplo.
- Los distractores deben corresponder a errores conceptuales reales, no a inventos.

FORMATO POR PREGUNTA:
- Enunciado.
- Alternativas A–E.
- Respuesta correcta (solo la letra).
- Explicación breve de por qué las otras 4 están mal.`,

  problemas: `Actúa como profesor de {curso} nivel UNI. Generá {cantidad} problemas sobre "{tema}" con dificultad {dificultad}.

═══ DEFINICIÓN OPERATIVA DE DIFICULTAD ═══

- BAJA: se resuelve aplicando UNA fórmula o propiedad directa.
- MEDIA: requiere 2 pasos y elegir entre 2 propiedades posibles.
- ALTA: requiere combinar 2+ propiedades, o un trazo auxiliar (recta paralela, perpendicular, punto medio, extensión, cambio de variable), o un cambio de representación. La solución NO debe ser evidente después de leer el enunciado. Debe haber al menos UN paso no obvio.

═══ REGLAS DE ORO (violarlas = problema descartado) ═══

1. NO DATOS DECORATIVOS: todo dato del enunciado debe ser usado en la solución. Si un triángulo/punto/valor no aporta nada al resultado, no debe aparecer.

2. NO MÉTODO ALTERNATIVO: el problema NO debe poder resolverse por un camino genérico distinto al tema. Ejemplo: si el tema es congruencia, el problema NO debe resolverse también con ley de cosenos sin usar la congruencia. Si se puede, descartalo.

3. NO TRIVIALIZAR: si el resultado sale en 1 línea mental, no sirve.

4. DISTRACTORES REALES: cada alternativa incorrecta debe corresponder a un error plausible (olvidar un caso, cambiar un signo, aplicar mal una propiedad, confundir dos teoremas). Prohibido números random.

5. ÚNICA RESPUESTA: solo una alternativa correcta, verificada.

═══ FLUJO INTERNO OBLIGATORIO ═══

Antes de escribir el problema:
a) Resolvelo por tu cuenta hasta un resultado único.
b) Verificá que ese resultado sea alcanzable solo con el tema {tema} (no por atajo alternativo).
c) Verificá que la dificultad declarada coincida con la real.
d) Si el problema es de dificultad ALTA, agregá el paso no obvio o el trazo auxiliar.
e) Construí las alternativas como errores plausibles alrededor del resultado correcto.

Si en cualquier paso falla (a-e), descartá el problema completo y generá otro.

═══ FORMATO DE SALIDA ═══

Para cada problema:
1. Enunciado (claro, sin ambigüedades).
2. Alternativas A–E.
3. Respuesta correcta (solo la letra).
4. Solución paso a paso (mostrando el paso no obvio si es alta).
5. Error típico: por qué alguien elegiría cada distractor.

═══ REGLA DE CONSISTENCIA MATEMÁTICA ═══

Resolvé primero, fijá el resultado, después escribí enunciado y alternativas. Nunca ajustes el resultado para que cierre con las opciones. Si hay inconsistencia, descartá y empezás de nuevo.`,

  simulacro: `Actúa como profesor de {curso} nivel UNI. Generá un simulacro de {cantidad} problemas sobre "{tema}" con dificultad {dificultad}.

DISTRIBUCIÓN:
- 40% dificultad baja
- 40% dificultad media
- 20% dificultad alta (con trazo auxiliar o paso no obvio)

REGLAS (aplican a cada problema):
- Prohibido agregar datos decorativos.
- El problema debe evaluar específicamente "{tema}". Prohibido usarlo como excusa.
- Cada distractor = error plausible real.
- Una sola respuesta correcta.

Formato:
1. Enunciado.
2. Alternativas A–E.
3. Respuesta correcta.
4. Solución paso a paso.
5. Errores típicos asociados a cada distractor.`,

  repaso_errores: `Actúa como profesor de {curso} nivel UNI.

Generá {cantidad} problemas sobre "{tema}" diseñados ESPECÍFICAMENTE para inducir errores típicos. Dificultad {dificultad}.

ERRORES OBJETIVO (elegí {cantidad} distintos, uno por problema):
- Confundir dos criterios/propiedades similares.
- Olvidar un caso especial (ángulo obtuso, raíz negativa, caso ambiguo).
- Aplicar una fórmula fuera de su dominio de validez.
- Saltar la verificación de existencia de solución.
- Mezclar notación o unidades.

Cada problema debe:
1. Estar construido para que el error típico sea tentador.
2. Tener como distractor principal el resultado del error.
3. Incluir explicación: "si elegiste X, probablemente confundiste Y con Z".

Formato:
1. Enunciado.
2. Alternativas A–E (con el error como distractor principal).
3. Respuesta correcta.
4. Explicación del error típico.`,

  resumen: `Actúa como profesor de {curso} nivel UNI.

Resumí "{tema}" en máximo 180 palabras. Dificultad: {dificultad}.

ESTRUCTURA:
- Idea central (1 línea).
- Propiedades clave con condición de uso (viñetas).
- 2 errores frecuentes.

REGLAS:
- Prohibido relleno.
- Prohibidas analogías vagas.
- Solo lo que se necesita para resolver un problema del tema.`
},

  buildPrompt(modo, params) {
    const preset = this.presets[modo] || this.presets.teoria;
    let prompt = preset;

    for (const [key, value] of Object.entries(params)) {
      prompt = prompt.replaceAll(`{${key}}`, value);
    }

    return prompt;
  },

  limpiarRespuesta(textoIA) {
    if (!textoIA) return "";
    return textoIA.trim();
  }
};




// Motor único de IA (Groq — API compatible con OpenAI)
const GroqEngine={
  baseUrl:'https://api.groq.com/openai/v1',

  getModel(){
    return document.getElementById('model-selector')?.value ||
           localStorage.getItem('uni-groq-model') ||
           'openai/gpt-oss-120b';
  },

  async listModels(){
    const apiKey=getGroqApiKey();
    if(!apiKey){
      throw new Error('API Key de Groq no configurada.');
    }
    try{
      const response=await fetch(`${this.baseUrl}/models`,{
        headers:{'Authorization':'Bearer '+apiKey}
      });
      if(!response.ok){
        const error=await response.json().catch(()=>({}));
        throw new Error(`Error listando modelos: ${error.error?.message||response.statusText}`);
      }
      const data=await response.json();
      return data.data||[];
    }catch(error){
      console.error('Error listando modelos:',error);
      throw error;
    }
  },

  async generateContent(params){
    const{curso,tema,dificultad='media',cantidad=5,modo='teoria'}=params;
    const apiKey=getGroqApiKey();
    if(!apiKey){
      throw new Error('API Key de Groq no configurada. Ve a Configuración para añadir tu API Key.');
    }

    const userPrompt=PromptPresets.buildPrompt(modo,{curso,tema,dificultad,cantidad});
    const requiresJson=['preguntas_conceptuales','problemas','simulacro','repaso_errores'].includes(modo);

    let systemPrompt=PromptPresets.systemPrompt;
    if(requiresJson){
      systemPrompt+='\n\nCRITICAL: You MUST respond ONLY with valid JSON. No markdown, no additional text, no explanations outside the JSON structure.\n\n'
        +'Required JSON structure:\n{\n  "preguntas": [\n    {\n      "id": 1,\n      "enunciado": "problem statement",\n      "alternativas": ["text of option A", "text of option B", "text of option C", "text of option D", "text of option E"],\n      "respuesta": "C",\n      "explicacion": "detailed explanation"\n    }\n  ]\n}\n\n'
        +'IMPORTANT: The "respuesta" field MUST contain ONLY the letter (A, B, C, D, or E) without any additional text, periods, or explanations.\n\n'
        +'Generate exactly '+cantidad+' questions.';
    }

    return await this.callGroq(systemPrompt,userPrompt,apiKey,requiresJson);
  },

  async callGroq(systemPrompt,userPrompt,apiKey,expectJson){
    try{
      const url=`${this.baseUrl}/chat/completions`;
      const response=await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer '+apiKey
        },
        body:JSON.stringify({
          model:this.getModel(),
          messages:[
            {role:'system',content:systemPrompt},
            {role:'user',content:userPrompt}
          ],
          temperature:0.7,
          max_tokens:4096,
          top_p:0.95
        })
      });

      if(!response.ok){
        const error=await response.json().catch(()=>({}));
        const errorMsg=error.error?.message||response.statusText;

        if(response.status===429){
          throw new Error('Rate limit de Groq alcanzado. Esperá unos segundos o cambiá a un modelo más liviano (llama-3.1-8b-instant).');
        }
        if(response.status===401){
          throw new Error('API Key inválida. Verificá tu key de Groq en Configuración.');
        }

        throw new Error(`Error Groq API: ${errorMsg}`);
      }

      const data=await response.json();
      const text=data.choices?.[0]?.message?.content||'';

      if(expectJson){
        let cleanText=text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
        const jsonMatch=cleanText.match(/\{[\s\S]*\}/);
        if(jsonMatch){
          cleanText=jsonMatch[0];
        }
        try{
          const parsed=JSON.parse(cleanText);
          console.log('JSON parseado exitosamente:',parsed);
          return parsed;
        }catch(e){
          console.error('Error parseando JSON. Respuesta original:',text);
          return {rawText:text,isFallback:true};
        }
      }

      return text;
    }catch(error){
      console.error('Error en GroqEngine:',error);
      throw error;
    }
  }
};
// UI de configuración de API Key
// UI de configuración de API Key (Groq)
async function openAIConfig(){
  const currentKey = getGroqApiKey();
  const key = prompt(
    'Introduce tu API Key de Groq (obtenla en https://console.groq.com/keys):',
    currentKey || ''
  );
  if(key === null) return;

  setGroqApiKey(key);

  if(!key.trim()){
    showToast('API Key vacía — cancelado', 'error');
    return;
  }

  showToast('Consultando modelos disponibles...', 'success');

  try {
    const apiKey = getGroqApiKey();
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers:{'Authorization':'Bearer '+apiKey}
    });
    const data = await response.json();

    if(!data.data || !data.data.length){
      const msg = data.error?.message || 'La API no devolvió modelos.';
      showToast('Error: ' + msg, 'error');
      console.error('Respuesta de la API:', data);
      return;
    }

    const usable = data.data.filter(m =>
      !/whisper|tts|guard|prompt-guard/i.test(m.id)
    );

    usable.sort((a, b) => {
      const score = n => n.includes('70b') ? 0 : n.includes('versatile') ? 1 : n.includes('8b') ? 2 : 3;
      return score(a.id) - score(b.id) || a.id.localeCompare(b.id);
    });

    const list = usable.map((m, i) => `${i + 1}. ${m.id}`).join('\n');

    const pick = prompt(
      `Modelos disponibles con tu API Key de Groq:\n\n${list}\n\nEscribe el NÚMERO del modelo que quieres usar por defecto:`,
      '1'
    );

    if(pick === null) return;

    const idx = parseInt(pick, 10) - 1;
    if(isNaN(idx) || idx < 0 || idx >= usable.length){
      showToast('Selección inválida.', 'error');
      return;
    }

    const chosenId = usable[idx].id;
    localStorage.setItem('uni-groq-model', chosenId);

    const sel = document.getElementById('model-selector');
    if(sel){
      let exists = [...sel.options].some(o => o.value === chosenId);
      if(!exists){
        const opt = document.createElement('option');
        opt.value = chosenId;
        opt.textContent = chosenId + ' (desde tu API Key)';
        sel.appendChild(opt);
      }
      sel.value = chosenId;
    }

    showToast(`✓ Modelo guardado: ${chosenId}`, 'success');
    console.log('Modelo seleccionado:', chosenId);

  } catch(error) {
    console.error('Error listando modelos:', error);
    showToast('Error: ' + error.message, 'error');
  }
}

// ── FASE 2: JSON ESTRUCTURADO + CORRECCIÓN AUTOMÁTICA ──

// Estado de preguntas activas
let currentQuestions=null;
let currentQuestionIndex=0;
let userAnswers={};

function renderInteractiveQuestions(questionsData){
  currentQuestions=questionsData.preguntas||[];
  currentQuestionIndex=0;
  userAnswers={};
  
  const container=document.getElementById('aiQuestionsContainer');
  if(!container){
    showToast('Error: contenedor de preguntas no encontrado','error');
    return;
  }
  
  container.innerHTML=currentQuestions.map((q,idx)=>`
    <div class="ai-question-card" id="qcard-${idx}" style="display:${idx===0?'block':'none'}">
      <div class="ai-q-header">
        <span class="ai-q-num">Pregunta ${idx+1}/${currentQuestions.length}</span>
        <span class="ai-q-progress">${idx+1}/${currentQuestions.length}</span>
      </div>
      <div class="ai-q-enunciado">${markdownToHTML(q.enunciado)}</div>
      <div class="ai-q-alternativas">
        ${q.alternativas.map((alt,altIdx)=>`
          <label class="ai-q-alt">
            <input type="radio" name="q-${idx}" value="${String.fromCharCode(65+altIdx)}" onchange="selectAnswer(${idx},'${String.fromCharCode(65+altIdx)}')">
            <span>${String.fromCharCode(65+altIdx)}. ${markdownToHTML(alt)}</span>
          </label>
        `).join('')}
      </div>
      <div class="ai-q-feedback" id="feedback-${idx}" style="display:none">
        <div class="ai-q-result" id="result-${idx}"></div>
        <div class="ai-q-explicacion" id="explicacion-${idx}"></div>
      </div>
      <div class="ai-q-nav">
        <button onclick="prevQuestion()" ${idx===0?'disabled':''}>← Anterior</button>
        <button onclick="checkAnswer(${idx})" id="check-${idx}" ${userAnswers[idx]?'':'disabled'}>Verificar</button>
        <button onclick="nextQuestion()" ${idx===currentQuestions.length-1?'disabled':''}>Siguiente →</button>
      </div>
    </div>
  `).join('');
  
  container.style.display='block';
}

function selectAnswer(qIdx,answer){
  userAnswers[qIdx]=answer;
  const checkBtn=document.getElementById(`check-${qIdx}`);
  if(checkBtn)checkBtn.disabled=false;
}

function checkAnswer(qIdx){
  const question=currentQuestions[qIdx];
  const userAnswer=userAnswers[qIdx];
  
  // Normalizar respuestas para comparación robusta
  const normalizeAnswer=(ans)=>{
    if(!ans)return '';
    return ans.toString().trim().toUpperCase().replace(/[^\w]/g,'');
  };
  
  const normalizedUserAnswer=normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer=normalizeAnswer(question.respuesta);
  
  const isCorrect=normalizedUserAnswer===normalizedCorrectAnswer;
  
  // Debug en consola
  console.log('Verificación:',{
    userAnswer,
    correctAnswer:question.respuesta,
    normalizedUserAnswer,
    normalizedCorrectAnswer,
    isCorrect
  });
  
  const feedbackEl=document.getElementById(`feedback-${qIdx}`);
  const resultEl=document.getElementById(`result-${qIdx}`);
  const explicacionEl=document.getElementById(`explicacion-${qIdx}`);
  
  feedbackEl.style.display='block';
  resultEl.textContent=isCorrect?'✓ ¡Correcto!':'✕ Incorrecto';
  resultEl.className='ai-q-result '+(isCorrect?'correct':'incorrect');
  
  explicacionEl.innerHTML='<strong>Explicación:</strong><br>'+markdownToHTML(question.explicacion);
  
  // Renderizar fórmulas matemáticas en la explicación
  if(typeof renderMathInElement!=='undefined'){
    renderMathInElement(explicacionEl,{
      delimiters:[
        {left:'$$',right:'$$',display:true},
        {left:'$',right:'$',display:false},
        {left:'\\[',right:'\\]',display:true},
        {left:'\\(',right:'\\)',display:false}
      ],
      throwOnError:false
    });
  }
  
  // Deshabilitar botón de verificar
  const checkBtn=document.getElementById(`check-${qIdx}`);
  if(checkBtn)checkBtn.disabled=true;
}

function prevQuestion(){
  if(currentQuestionIndex>0){
    document.getElementById(`qcard-${currentQuestionIndex}`).style.display='none';
    currentQuestionIndex--;
    document.getElementById(`qcard-${currentQuestionIndex}`).style.display='block';
  }
}

function nextQuestion(){
  if(currentQuestionIndex<currentQuestions.length-1){
    document.getElementById(`qcard-${currentQuestionIndex}`).style.display='none';
    currentQuestionIndex++;
    document.getElementById(`qcard-${currentQuestionIndex}`).style.display='block';
  }
}

// ── FASE 3: SISTEMA INTELIGENTE + REPETICIÓN ESPACIADA ──

// Extender datos de temas con metadatos de estudio
function ensureTopicMetadata(topicId){
  if(!S.t)S.t={};
  if(!S.t[topicId])S.t[topicId]={};
  const topic=S.t[topicId];
  
  if(topic.fechaUltimoEstudio===undefined)topic.fechaUltimoEstudio=null;
  if(topic.nivelDominio===undefined)topic.nivelDominio=0;
  if(topic.vecesRepasado===undefined)topic.vecesRepasado=0;
  
  return topic;
}

// Sistema de Priorización de Estudio
function findTopicInfo(id){
  const t = TOPIC_INDEX[id] || PLAN_PARTS[id];
  return t ? { curso: t.course, tema: t.name } : { curso:'', tema:'' };
}
function getTopic(id){
  if(TOPIC_INDEX[id]) return TOPIC_INDEX[id];
  if(PLAN_PARTS[id]) return { id, course: PLAN_PARTS[id].course, name: PLAN_PARTS[id].name };
  return { id, course:'', name:id };
}
const StudyPrioritizer={
  getRecommendation(){
    const td=today();
    const aw=WSCHED.find(w=>td>=w.s&&td<=w.e);

    if(!aw){
      return{type:'none',reason:'Fuera de semana activa',curso:null,tema:null};
    }

    // Prioridad 1: Desbloquear prereqs débiles
    const blockedBy=aw.topics.filter(id=>{
      const info=getTopicDependencyInfo(id);
      return info.blocked;
    });
    if(blockedBy.length>0){
      const allWeakPrereqs=new Set();
      blockedBy.forEach(id=>getPrereqs(id).forEach(p=>{
        if(getTopicMastery(p)<40&&aw.topics.includes(p))allWeakPrereqs.add(p);
      }));
      const sorted=[...allWeakPrereqs].sort((a,b)=>getDependents(b).length-getDependents(a).length);
      if(sorted.length){
        const nextId=sorted[0];
        const info=findTopicInfo(nextId);
        return{
          type:'unblock',
          reason:'🔓 Desbloquea '+getDependents(nextId).length+' temas',
          curso:info.curso,
          tema:info.tema,
          topicId:nextId
        };
      }
    }

    // Prioridad 2: Cuellos de botella (2+ dependientes, tú débil)
    const bottlenecks=aw.topics.filter(id=>{
      const info=getTopicDependencyInfo(id);
      return info.isBottleneck;
    }).sort((a,b)=>getDependents(b).length-getDependents(a).length);
    if(bottlenecks.length>0){
      const nextId=bottlenecks[0];
      const info=findTopicInfo(nextId);
      return{
        type:'bottleneck',
        reason:'🎯 Cuello de botella — desbloquea '+getDependents(nextId).length+' temas',
        curso:info.curso,
        tema:info.tema,
        topicId:nextId
      };
    }

    // Prioridad 3: Temas nuevos no bloqueados
    const unseen=aw.topics.filter(id=>{
      const topic=S.t?.[id];
      if(topic&&topic.done)return false;
      const info=getTopicDependencyInfo(id);
      return !info.blocked;
    });
    if(unseen.length>0){
      const nextId=unseen[0];
      const info=findTopicInfo(nextId);
      return{
        type:'new',
        reason:'Tema nuevo — prereqs OK',
        curso:info.curso,
        tema:info.tema,
        topicId:nextId
      };
    }

    // Prioridad 4: Temas débiles (dominio < 50)
    const weak=aw.topics.filter(id=>{
      const topic=S.t?.[id];
      return topic&&topic.done&&(topic.nivelDominio||0)<50;
    }).sort((a,b)=>(S.t[a].nivelDominio||0)-(S.t[b].nivelDominio||0));
    if(weak.length>0){
      const nextId=weak[0];
      const info=findTopicInfo(nextId);
      return{
        type:'weak',
        reason:'Tema débil — necesita refuerzo',
        curso:info.curso,
        tema:info.tema,
        topicId:nextId
      };
    }

    // Prioridad 5: Repasos pendientes (repetición espaciada)
    const pendingReview=aw.topics.filter(id=>{
      const topic=S.t?.[id];
      if(!topic||!topic.reviewDates)return false;
      const todayDate=new Date();
      return topic.reviewDates.some(dateStr=>{
        const reviewDate=new Date(dateStr);
        return reviewDate<=todayDate;
      });
    });
    if(pendingReview.length>0){
      const nextId=pendingReview[0];
      const info=findTopicInfo(nextId);
      return{
        type:'review',
        reason:'Repaso pendiente — repetición espaciada',
        curso:info.curso,
        tema:info.tema,
        topicId:nextId
      };
    }

    // Si todo está completado, sugerir siguiente semana
    const nextWeekIdx=WSCHED.findIndex(w=>w.id===aw.id)+1;
    if(nextWeekIdx<WSCHED.length){
      const nextWeek=WSCHED[nextWeekIdx];
      const firstTopic=nextWeek.topics[0];
      const info=findTopicInfo(firstTopic);
      return{
        type:'next_week',
        reason:'Semana actual completada — avanzando',
        curso:info.curso,
        tema:info.tema,
        topicId:firstTopic
      };
    }

    return{type:'complete',reason:'¡Todo completado!',curso:null,tema:null};
  },
  
  // Actualizar nivel de dominio después de estudiar
  updateDominio(topicId,performance){
    const topic=ensureTopicMetadata(topicId);
    const current=topic.nivelDominio||0;
    // Suavizado exponencial: cada respuesta mueve el dominio un 25% hacia el nuevo performance
    const alpha=0.25;
    topic.nivelDominio=Math.round(current*(1-alpha)+performance*alpha);
    topic.fechaUltimoEstudio=today();
    topic.vecesRepasado=(topic.vecesRepasado||0)+1;
    save();
  },
  
  // Programar repasos espaciados
  scheduleReviews(topicId){
    const topic=ensureTopicMetadata(topicId);
    const now=new Date();
    const reviewsCount=topic.vecesRepasado||0;
    
    // Primer repaso: 7 días, segundo: 15, tercero: 30
    const intervals=[7,15,30];
    const interval=intervals[Math.min(reviewsCount,intervals.length-1)];
    
    const reviewDate=new Date(now);
    reviewDate.setDate(reviewDate.getDate()+interval);
    
    if(!topic.reviewDates)topic.reviewDates=[];
    topic.reviewDates.push(localKey(reviewDate));
    
    save();
  }
};

// UI del botón "Continuar estudio"
function renderContinueStudyButton(){
  const container=document.getElementById('continueStudyContainer');
  if(!container)return;
  
  const rec=StudyPrioritizer.getRecommendation();
  
  let icon='▶';
  let label='Continuar estudio';
  let subtext='';
  
  switch(rec.type){
    case 'new':
      icon='🆕';
      subtext='Tema nuevo: '+rec.tema;
      break;
    case 'weak':
      icon='⚠';
      subtext='Refuerzo necesario: '+rec.tema;
      break;
    case 'review':
      icon='🔄';
      subtext='Repaso pendiente: '+rec.tema;
      break;
    case 'next_week':
      icon='→';
      subtext='Siguiente semana: '+rec.tema;
      break;
    case 'complete':
      icon='✓';
      label='¡Plan completado!';
      subtext='Has terminado todo el temario';
      break;
    default:
      icon='📋';
      subtext='Selecciona qué estudiar';
  }
  
  container.innerHTML=`
    <button class="continue-study-btn" onclick="handleContinueStudy()" ${rec.type==='complete'?'disabled':''}>
      <span class="csb-icon">${icon}</span>
      <span class="csb-label">${label}</span>
      <span class="csb-sub">${subtext}</span>
    </button>
  `;
}

function handleContinueStudy(){
  const rec=StudyPrioritizer.getRecommendation();
  
  if(rec.type==='none'||rec.type==='complete'){
    showToast(rec.reason);
    return;
  }
  
  // Abrir modal de estudio guiado
  openStudyGuidedModal(rec);
}

// Modal de estudio guiado
function openStudyGuidedModal(recommendation){
  const modal=document.getElementById('studyGuidedModal');
  if(!modal){
    showToast('Error: modal no encontrado','error');
    return;
  }
  
  document.getElementById('sg-curso').value=recommendation.curso||'';
  document.getElementById('sg-tema').value=recommendation.tema||'';
  document.getElementById('sg-reason').textContent=recommendation.reason;
  
  modal.classList.add('on');
}

function closeStudyGuidedModal(){
  document.getElementById('studyGuidedModal').classList.remove('on');
}

async function generateAIContent(){
  const curso=document.getElementById('sg-curso').value;
  const tema=document.getElementById('sg-tema').value;
  const dificultad=document.getElementById('sg-dificultad').value;
  const cantidad=document.getElementById('sg-cantidad').value;
  const modo=document.getElementById('sg-modo').value;
  
  if(!curso||!tema){
    showToast('Selecciona curso y tema','error');
    return;
  }
  
  if(!hasGroqApiKey()){
    showToast('Primero configura tu API Key de Groq','error');
    openAIConfig();
    return;
  }
  
  const btn=document.getElementById('sg-generate-btn');
  btn.disabled=true;
  btn.textContent='Generando...';
  
  showToast('Enviando petición a Gemini...','success');
  
  try{
    const result=await GroqEngine.generateContent({
      curso,tema,dificultad,cantidad:parseInt(cantidad),modo
    });
    
    // Manejar fallback si JSON falló
    if(result.isFallback){
      document.getElementById('aiTextResult').innerHTML=markdownToHTML(result.rawText).replace(/\n/g,'<br>');
      document.getElementById('aiTextContainer').style.display='block';
      closeStudyGuidedModal();
      showToast('⚠ JSON inválido, mostrando respuesta cruda','error');
      return;
    }
    
    if(typeof result==='object'&&result.preguntas){
      // Modo interactivo - registrar en estadísticas
      closeStudyGuidedModal();
      renderInteractiveQuestions(result);
      
      // Registrar sesión de IA
      registerAISession(curso,tema,modo,result.preguntas.length,dificultad);
      
      // Agregar preguntas al banco de problemas
      addAIQuestionsToBank(curso,tema,result.preguntas,modo);
      
      showToast('✓ Contenido generado exitosamente','success');
    }else{
      // Modo texto (teoría, resumen)
      document.getElementById('aiTextResult').innerHTML=markdownToHTML(result).replace(/\n/g,'<br>');
      document.getElementById('aiTextContainer').style.display='block';
      closeStudyGuidedModal();
      
      // Renderizar fórmulas matemáticas con KaTeX
      if(typeof renderMathInElement!=='undefined'){
        renderMathInElement(document.getElementById('aiTextResult'),{
          delimiters:[
            {left:'$$',right:'$$',display:true},
            {left:'$',right:'$',display:false},
            {left:'\\[',right:'\\]',display:true},
            {left:'\\(',right:'\\)',display:false}
          ],
          throwOnError:false
        });
      }
      
      // Registrar sesión de IA para modo texto
      registerAISession(curso,tema,modo,1,dificultad);
      
      showToast('✓ Contenido generado exitosamente','success');
    }
  }catch(error){
    showToast('Error: '+error.message,'error');
  }finally{
    btn.disabled=false;
    btn.textContent='Generar contenido';
  }
}

// ── REGISTRAR SESIONES DE IA EN ESTADÍSTICAS ──
function registerAISession(curso,tema,modo,cantidad,dificultad){
  if(!S.sessions)S.sessions=[];
  
  const td=today();
  const session={
    date:td,
    timestamp:Date.now(),
    course:curso,
    topic:tema,
    mode:modo,
    count:parseInt(cantidad),
    difficulty:dificultad,
    type:'ai_generated',
    duration:0 // Se puede calcular si se implementa timer
  };
  
  S.sessions.push(session);
  save();
  
  // Actualizar estadísticas de horas (considerar 5 minutos por pregunta como estimación)
  if(!S.h)S.h={};
  const estimatedMinutes=cantidad*5;
  const estimatedSeconds=estimatedMinutes*60;
  S.h[td]=(S.h[td]||0)+estimatedSeconds;
  
  // Actualizar estadísticas por curso
  if(!S.dailySegments)S.dailySegments={};
  if(!S.dailySegments[td])S.dailySegments[td]={};
  if(!S.dailySegments[td][curso])S.dailySegments[td][curso]={teoria:0,ejercicios:0,repaso:0};
  
  if(modo==='teoria'||modo==='resumen'){
    S.dailySegments[td][curso].teoria+=estimatedSeconds;
  }else if(modo==='repaso_errores'){
    S.dailySegments[td][curso].repaso+=estimatedSeconds;
  }else{
    S.dailySegments[td][curso].ejercicios+=estimatedSeconds;
  }
  
  save();
  updateSidebar();
  renderHome();
}

// ── AGREGAR PREGUNTAS IA AL BANCO DE PROBLEMAS ──
function addAIQuestionsToBank(curso,tema,preguntas,modo){
  if(!S.bank)S.bank=[];
  
  const td=today();
  const dateStr=new Date().toLocaleDateString('es-PE');
  
  preguntas.forEach((pregunta,index)=>{
    const bankItem={
      course:curso,
      tema:tema,
      prob:pregunta.enunciado,
      sol:pregunta.explicacion||pregunta.respuesta,
      date:dateStr,
      source:'ai_generated',
      mode:modo,
      difficulty:pregunta.dificultad||'media',
      alternatives:pregunta.alternativas||[],
      correctAnswer:pregunta.respuesta||''
    };
    S.bank.push(bankItem);
  });
  
  save();
  showToast(`✓ ${preguntas.length} preguntas agregadas al banco de problemas`,'success');
}

// Toast con acción "Deshacer" — desaparece a los 8s
function showUndoToast(message,onUndo){
  let container=document.querySelector('.toast-container');
  if(!container){
    container=document.createElement('div');
    container.className='toast-container';
    document.body.appendChild(container);
  }
  const toast=document.createElement('div');
  toast.className='toast undo';
  toast.innerHTML=`
    <span class="toast-icon">🗑</span>
    <span class="toast-message">${message}</span>
    <button class="toast-action">Deshacer</button>
  `;
  const btn=toast.querySelector('.toast-action');
  let undone=false;
  const doUndo=()=>{
    if(undone)return;
    undone=true;
    clearTimeout(timer);
    toast.style.animation='slideOut 0.3s ease-out forwards';
    setTimeout(()=>toast.remove(),300);
    if(typeof onUndo==='function')onUndo();
  };
  btn.onclick=doUndo;
  container.appendChild(toast);
  const timer=setTimeout(()=>{
    if(undone)return;
    toast.style.animation='slideOut 0.3s ease-out forwards';
    setTimeout(()=>toast.remove(),300);
  },8000);
}

// Sistema de Notificaciones Toast
function showToast(message,type='success'){
  const container=document.querySelector('.toast-container');
  if(!container){
    const toastContainer=document.createElement('div');
    toastContainer.className='toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast=document.createElement('div');
  toast.className=`toast ${type}`;
  
  const icon=type==='success'?'✓':'⚠';
  toast.innerHTML=`
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  const containerEl=document.querySelector('.toast-container');
  containerEl.appendChild(toast);
  
  setTimeout(()=>{
    toast.style.animation='slideOut 0.3s ease-out forwards';
    setTimeout(()=>{
      toast.remove();
    },300);
  },4000);
}

// Estilos CSS para componentes de IA (agregados dinámicamente)
function injectAIStyles(){
  const style=document.createElement('style');
  style.textContent=`
    .continue-study-btn{
      width:100%;
      background:linear-gradient(135deg,var(--accent),var(--accent3));
      border:none;
      padding:1rem;
      border-radius:8px;
      color:#000;
      font-family:'Syne',sans-serif;
      font-size:1rem;
      font-weight:700;
      cursor:pointer;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:0.3rem;
      transition:transform 0.2s,box-shadow 0.2s;
    }
    .continue-study-btn:hover:not(:disabled){
      transform:translateY(-2px);
      box-shadow:0 4px 20px rgba(99,102,241,0.4);
    }
    .continue-study-btn:disabled{
      opacity:0.5;
      cursor:not-allowed;
    }
    .csb-icon{font-size:1.5rem;}
    .csb-label{font-size:0.9rem;}
    .csb-sub{font-size:0.65rem;color:rgba(0,0,0,0.7);}
    
    .study-guided-modal{
      display:none;
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.8);
      z-index:2000;
      align-items:center;
      justify-content:center;
    }
    .study-guided-modal.on{display:flex;}
    .sg-content{
      background:var(--card);
      border:1px solid var(--border);
      padding:2rem;
      border-radius:12px;
      width:90%;
      max-width:500px;
      max-height:90vh;
      overflow-y:auto;
    }
    .sg-header{
      font-family:'Syne',sans-serif;
      font-size:1.2rem;
      font-weight:700;
      color:var(--accent);
      margin-bottom:1rem;
    }
    .sg-form{display:flex;flex-direction:column;gap:0.8rem;}
    .sg-form label{font-size:0.6rem;color:var(--muted);text-transform:uppercase;}
    .sg-form select,.sg-form input{
      background:var(--bg);
      border:1px solid var(--border);
      color:var(--text);
      padding:0.5rem;
      border-radius:4px;
      font-family:'DM Mono',monospace;
    }
    .sg-reason{
      background:var(--accent);
      color:#000;
      padding:0.5rem;
      border-radius:4px;
      font-size:0.65rem;
      margin-bottom:1rem;
    }
    .sg-actions{
      display:flex;
      gap:0.5rem;
      margin-top:1rem;
    }
    .sg-actions button{
      flex:1;
      padding:0.6rem;
      border-radius:4px;
      cursor:pointer;
      font-family:'DM Mono',monospace;
      font-size:0.65rem;
    }
    .sg-generate{
      background:var(--accent3);
      color:#000;
      border:none;
    }
    .sg-cancel{
      background:transparent;
      border:1px solid var(--border);
      color:var(--muted);
    }
    
    .ai-question-card{
      background:var(--card);
      border:1px solid var(--border);
      padding:1.5rem;
      border-radius:8px;
      margin-bottom:1rem;
    }
    .ai-q-header{
      display:flex;
      justify-content:space-between;
      margin-bottom:1rem;
      font-size:0.65rem;
      color:var(--muted);
    }
    .ai-q-enunciado{
      font-size:0.85rem;
      line-height:1.6;
      margin-bottom:1.5rem;
      color:var(--text);
    }
    .ai-q-alternativas{
      display:flex;
      flex-direction:column;
      gap:0.5rem;
      margin-bottom:1.5rem;
    }
    .ai-q-alt{
      display:flex;
      align-items:center;
      gap:0.5rem;
      padding:0.5rem;
      background:var(--bg);
      border:1px solid var(--border);
      border-radius:4px;
      cursor:pointer;
      transition:border-color 0.2s;
    }
    .ai-q-alt:hover{border-color:var(--accent);}
    .ai-q-alt input{accent-color:var(--accent);}
    .ai-q-alt span{font-size:0.7rem;}
    
    .ai-q-feedback{
      margin-top:1rem;
      padding:1rem;
      background:var(--bg);
      border-radius:4px;
    }
    .ai-q-result{
      font-size:0.8rem;
      font-weight:700;
      margin-bottom:0.5rem;
    }
    .ai-q-result.correct{color:var(--accent3);}
    .ai-q-result.incorrect{color:var(--accent2);}
    .ai-q-explicacion{
      font-size:0.7rem;
      line-height:1.5;
      color:var(--muted);
    }
    
    .ai-q-nav{
      display:flex;
      gap:0.5rem;
      margin-top:1rem;
    }
    .ai-q-nav button{
      flex:1;
      padding:0.5rem;
      background:var(--card);
      border:1px solid var(--border);
      color:var(--text);
      border-radius:4px;
      cursor:pointer;
      font-family:'DM Mono',monospace;
      font-size:0.65rem;
      transition:all 0.2s;
    }
    .ai-q-nav button:hover:not(:disabled){
      border-color:var(--accent);
      color:var(--accent);
    }
    .ai-q-nav button:disabled{
      opacity:0.3;
      cursor:not-allowed;
    }
    
    #aiTextContainer{
      display:none;
      background:var(--card);
      border:1px solid var(--border);
      padding:1.5rem;
      border-radius:8px;
      margin-top:1rem;
      font-size:0.8rem;
      line-height:1.6;
    }
    
    /* Toast Notifications */
    .toast-container{
      position:fixed;
      top:20px;
      right:20px;
      z-index:9999;
      display:flex;
      flex-direction:column;
      gap:10px;
    }
    .toast{
      min-width:300px;
      max-width:400px;
      padding:16px 20px;
      border-radius:8px;
      color:#fff;
      font-family:'DM Mono',monospace;
      font-size:0.75rem;
      line-height:1.4;
      box-shadow:0 4px 12px rgba(0,0,0,0.3);
      animation:slideIn 0.3s ease-out;
      display:flex;
      align-items:center;
      gap:12px;
    }
    .toast.success{
      background:linear-gradient(135deg,#3b82f6,#1d4ed8);
      border-left:4px solid #60a5fa;
    }
    .toast.error{
      background:linear-gradient(135deg,#ef4444,#b91c1c);
      border-left:4px solid #f87171;
    }
    .toast.undo{
      background:linear-gradient(135deg,#3a3a50,#25253a);
      border-left:4px solid var(--accent2);
    }
    .toast-action{
      background:transparent;
      border:1px solid rgba(255,255,255,.3);
      color:#fff;
      padding:.25rem .55rem;
      border-radius:4px;
      font-family:inherit;
      font-size:.68rem;
      font-weight:700;
      cursor:pointer;
      letter-spacing:.02em;
      transition:all .15s;
      flex-shrink:0;
    }
    .toast-action:hover{
      background:rgba(255,255,255,.15);
      border-color:rgba(255,255,255,.5);
    }
    .toast-icon{
      font-size:1.2rem;
      flex-shrink:0;
    }
    .toast-message{
      flex:1;
    }
    @keyframes slideIn{
      from{
        transform:translateX(100%);
        opacity:0;
      }
      to{
        transform:translateX(0);
        opacity:1;
      }
    }
    @keyframes slideOut{
      from{
        transform:translateX(0);
        opacity:1;
      }
      to{
        transform:translateX(100%);
        opacity:0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Inicializar componentes de IA
function initAIComponents(){
  injectAIStyles();
  renderContinueStudyButton();
}



// Inicializar AI components al cargar
initAIComponents();
/* ═══ CRONÓMETRO POR TEMA ═══ */
let chronoInt=null, chronoSecs=0, chronoRun=false, chronoStart=null;
let chronoCounts={easy:0,hard:0,skipped:0,failed:0};
// ═══ MODO CRONÓMETRO ═══
let _chronoMode = 'normal'; // 'normal' | 'sim'
function setChronoMode(mode){
  _chronoMode = mode;
  const normal = document.getElementById('chronoNormalUI');
  const btnN = document.getElementById('chronoModeNormal');
  const btnS = document.getElementById('chronoModeSim');
  const overlay = document.getElementById('simOverlay');

  // Abrir/cerrar el overlay del simulacro
  if(overlay){
    if(mode === 'sim'){
      overlay.style.display = 'flex';
      document.getElementById('simConfigScreen').style.display = 'flex';
      document.getElementById('simCaptureScreen').style.display = 'none';
      document.getElementById('simErrorScreen').style.display = 'none';
    } else {
      overlay.style.display = 'none';
    }
  }

  if(!normal || !btnN || !btnS) return;

  normal.style.display = (mode === 'normal') ? '' : 'none';
  btnN.style.background = (mode === 'normal') ? 'var(--accent)' : 'transparent';
  btnN.style.borderColor = (mode === 'normal') ? 'var(--accent)' : 'var(--border)';
  btnN.style.color = (mode === 'normal') ? '#000' : 'var(--muted)';
  btnN.style.fontWeight = (mode === 'normal') ? '700' : '';
  btnS.style.background = (mode === 'sim') ? 'var(--accent)' : 'transparent';
  btnS.style.borderColor = (mode === 'sim') ? 'var(--accent)' : 'var(--border)';
  btnS.style.color = (mode === 'sim') ? '#000' : 'var(--muted)';
  btnS.style.fontWeight = (mode === 'sim') ? '700' : '';
}



// ═══ FIN MODO MIXTO ═══

function setPomoTab(tab){
  document.querySelectorAll('.pomo-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const pc=document.getElementById('pomoContent');
  const cc=document.getElementById('chronoContent');
  if(pc)pc.style.display=tab==='pomo'?'':'none';
  if(cc)cc.style.display=tab==='chrono'?'':'none';
}

function updateChronoTopics(){
  const course=document.getElementById('chronoCourse').value;
  const sel=document.getElementById('chronoTopic');
  sel.innerHTML='<option value="" disabled selected hidden>tema</option>';
  if(!course||!TOPICS[course])return;
  Object.entries(TOPICS[course]).forEach(([id,name])=>{
    const opt=document.createElement('option');
    opt.value=id;
    opt.textContent=name;
    sel.appendChild(opt);
  });
}

function chronoToggle(){
  if(chronoRun){
    // Terminar sesión
    chronoRun=false;
    clearInterval(chronoInt);
    const course=document.getElementById('chronoCourse').value;
    const topicId=document.getElementById('chronoTopic').value;
    if(!course||!topicId){showToast('Selecciona curso y tema');chronoReset();return;}
    const total=chronoCounts.easy+chronoCounts.hard+chronoCounts.skipped+chronoCounts.failed;
    if(total===0){showToast('No registraste ningún problema');chronoReset();return;}
    if(chronoSecs<5){showToast('Muy corto, no se guardó');chronoReset();return;}
    if(!S.speedSessions)S.speedSessions=[];
    const topicName=TOPICS[course]?.[topicId]||topicId;
    S.speedSessions.push({
      topicId, course, topic:topicName,
      secs:chronoSecs,
      easy:chronoCounts.easy, hard:chronoCounts.hard,
      skipped:chronoCounts.skipped, failed:chronoCounts.failed,
      date:today(), ts:Date.now()
    });
    save();

    // ⬇️ NUEVO: enviar info al plan de estudio
    const resolved=chronoCounts.easy+chronoCounts.hard;
    if(resolved>0){
      if(!S.exCount)S.exCount={};
      const goal=getExGoal(topicId);
      S.exCount[topicId]=Math.min(goal,(S.exCount[topicId]||0)+resolved);
      renderExBadge(topicId);
    }
    if(!S.t)S.t={};S.t[topicId]=S.t[topicId]||{};
    S.t[topicId].speedSecs=(S.t[topicId].speedSecs||0)+chronoSecs;
    S.t[topicId].speedProbs=(S.t[topicId].speedProbs||0)+total;
    S.t[topicId].speedLast=today();
    save();
    renderTopicSpeed(topicId);

    const tpp=Math.round(chronoSecs/total);
    const aciertos=chronoCounts.easy+chronoCounts.hard;
    const acc=Math.round(aciertos/total*100);
    const skip=Math.round(chronoCounts.skipped/total*100);

    // Conectar con el grafo: el acierto real actualiza el dominio del tema
    // (los saltados cuentan como 40, entre fallo y acierto con esfuerzo)
    // Acierto puro
    const rawAcc = (chronoCounts.easy*100 + chronoCounts.hard*70 + chronoCounts.skipped*40 + chronoCounts.failed*10) / total;

    // Penalización por lentitud (solo si acertaste algo)
    const target = getSpeedTarget(course);
    const speedRatio = target ? tpp / target : 1;
    let speedPenalty = 1;
    if(speedRatio > 1.5)      speedPenalty = 0.7;   // lentísimo
    else if(speedRatio > 1.2) speedPenalty = 0.85;  // lento
    else if(speedRatio < 0.8) speedPenalty = 1.1;   // rápido

    const effectiveAcc = Math.round(Math.min(100, rawAcc * speedPenalty));
    StudyPrioritizer.updateDominio(topicId, effectiveAcc);

     const body='<div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem .7rem">'
      +'<span style="color:var(--muted)">Problemas</span><b>'+total+'</b>'
      +'<span style="color:var(--muted)">Duración</span><b>'+Math.floor(chronoSecs/60)+'m '+(chronoSecs%60)+'s</b>'
      +'<span style="color:var(--muted)">Tiempo/problema</span><b>'+tpp+'s</b>'
      +'<span style="color:var(--muted)">Acierto</span><b style="color:'+(acc>=70?'var(--accent3)':'var(--accent4)')+'">'+acc+'%</b>'
      +'<span style="color:var(--muted)">Saltados</span><b style="color:'+(skip>=20?'#f0a500':'var(--muted)')+'">'+skip+'%</b>'
      +'<span style="color:var(--muted)">Dominio</span><b>'+effectiveAcc+'%</b>'
      +'</div>';
    showModal('Sesión guardada',body,{accent:'var(--accent3)',icon:'✅'});
    chronoReset();
    if(typeof renderSpeedStats==='function')renderSpeedStats();
    refreshPlanIcons();
  } else {
    // Iniciar sesión
    const course=document.getElementById('chronoCourse').value;
    const topicId=document.getElementById('chronoTopic').value;
    if(!course||!topicId){showToast('Selecciona curso y tema primero');return;}
    // Aviso si el pomodoro está activo: no duplica horas, pero es bueno saberlo
    if(pRun){
      const meta=document.getElementById('chronoMeta');
      if(meta)meta.innerHTML='<span style="color:var(--accent3)">⏱ pomodoro contando (sin duplicar horas)</span>';
    }
    chronoRun=true;
    chronoStart=Date.now();
    chronoSecs=0;
    chronoCounts={easy:0,hard:0,skipped:0,failed:0};
    updateChronoCounts();
    document.getElementById('chronoStart').textContent='■ terminar';
    document.getElementById('chronoStart').classList.add('on');
    document.getElementById('chronoCounters').style.display='block';
    updateChronoDisp();
    chronoInt=setInterval(()=>{
      chronoSecs=Math.floor((Date.now()-chronoStart)/1000);
      updateChronoDisp();
    },500);
  }
}

function chronoCount(kind){
  if(!chronoRun)return;
  chronoCounts[kind]=(chronoCounts[kind]||0)+1;
  updateChronoCounts();
}



function updateChronoCounts(){
  ['easy','hard','skipped','failed'].forEach(k=>{
    const el=document.getElementById('c'+k.charAt(0).toUpperCase()+k.slice(1));
    if(el)el.textContent=chronoCounts[k]||0;
  });
  const total=chronoCounts.easy+chronoCounts.hard+chronoCounts.skipped+chronoCounts.failed;
  const meta=document.getElementById('chronoMeta');
  if(meta)meta.textContent=total?(total+' problema'+(total===1?'':'s')+' registrados'):(chronoRun?'— sin problemas aún':'— sin problemas aún');
}

function updateChronoDisp(){
  const m=String(Math.floor(chronoSecs/60)).padStart(2,'0');
  const s=String(chronoSecs%60).padStart(2,'0');
  const el=document.getElementById('chronoDisp');
  if(el)el.textContent=m+':'+s;
  updateChronoCounts();
}

function chronoReset(){
  chronoRun=false;
  clearInterval(chronoInt);
  chronoSecs=0;
  chronoCounts={easy:0,hard:0,skipped:0,failed:0};
  const disp=document.getElementById('chronoDisp');
  if(disp)disp.textContent='00:00';
  const btn=document.getElementById('chronoStart');
  if(btn){btn.textContent='▶ iniciar';btn.classList.remove('on');}
  const ctr=document.getElementById('chronoCounters');
  if(ctr)ctr.style.display='none';
  updateChronoCounts();
}

function initChrono(){
  const sel=document.getElementById('chronoCourse');
  if(sel){
    sel.innerHTML='<option value="" disabled selected hidden>curso</option>';
    Object.keys(TOPICS).forEach(name=>{
      const opt=document.createElement('option');
      opt.value=name;
      opt.textContent=name;
      sel.appendChild(opt);
    });
  }
}

// ═══ HELPER KATEX GLOBAL ═══
function renderMath(el){
  if(!el||typeof renderMathInElement==='undefined')return;
  try{
    renderMathInElement(el,{
      delimiters:[
        {left:'$$',right:'$$',display:true},
        {left:'$',right:'$',display:false},
        {left:'\\[',right:'\\]',display:true},
        {left:'\\(',right:'\\)',display:false}
      ],
      throwOnError:false,
      errorColor:'#f87171',
      ignoredTags:['script','noscript','style','textarea','pre','code','option']
    });
  }catch(e){}
}

// Renderiza KaTeX en Todos los contenedores de contenido libre
function renderMathEverywhere(){
  const targets=[
    'fcFrontContent','fcBackContent',        // flashcards
    'bankList',                              // banco
    'elist','homeErrRecientes','homeErrCapActual', // errores
    'globalNotes',                           // notas globales
    'aiTextResult'                           // IA
  ];
  targets.forEach(id=>{
    const el=document.getElementById(id);
    if(el)renderMath(el);
  });
  // Notas por tema (clase tnote-input)
  document.querySelectorAll('.tnote-input').forEach(inp=>{
    if(inp.value)renderMath(inp.parentElement);
  });
}
function toggleFCMode(){
  document.body.classList.toggle('fc-focus');
  if(document.body.classList.contains('fc-focus')){
    document.documentElement.style.overflow='hidden';
  } else {
    document.documentElement.style.overflow='';
  }
}

function delFC(){
  if(!_fcQueue||!_fcQueue.length){showToast('No hay tarjeta activa.');return;}
  const card=_fcQueue[0];
  const idx=S.fc.findIndex(c=>c===card||(c.q===card.q&&c.a===card.a&&c.course===card.course));
  if(idx<0){_fcQueue.shift();renderFC();return;}
  const backup={card:S.fc[idx],idx};
  S.fc.splice(idx,1);
  _fcQueue.shift();
  save();
  renderFC();
  showUndoToast('Tarjeta borrada',()=>{
    S.fc.splice(backup.idx,0,backup.card);
    _fcQueue=null;
    save();
    renderFC();
    showToast('✓ Tarjeta restaurada','success');
  });
}
// ═══ EMOJIS GLOBALES DE CURSOS ═══



function courseEmoji(name){
  return COURSE_EMOJIS[name]||'';
}

function courseLabel(name){
  const em=courseEmoji(name);
  return (em?em+' ':'')+(name||'');
}

// Decora los <option> de Todos los selects (funciona en vivo)
(function(){
  function decorate(){
    document.querySelectorAll('option').forEach(opt=>{
      const raw=opt.textContent.trim();
      const plain=raw.replace(/^[\p{Emoji}\u200d\ufe0f]+\s*/u,'').trim();
      const em=COURSE_EMOJIS[plain];
      if(em && !raw.startsWith(em)){
        // ⚠️ CRÍTICO: si el option no tenía value explícito, fijarlo
        // ANTES de modificar el texto. Si no, el value queda con emoji.
        if(!opt.hasAttribute('value')){
          opt.value = plain;
        }
        opt.textContent = em + ' ' + plain;
      }
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',decorate);
  }else{
    decorate();
  }
  const mo=new MutationObserver(()=>decorate());
  mo.observe(document.body,{childList:true,subtree:true});
})();

/* ═══ VELOCIDAD POR TEMA — Stats ═══ */



function renderSpeedStats(){
  const el=document.getElementById('speedStatsBox');
  if(!el)return;
  const sessions=S.speedSessions||[];
  if(!sessions.length){
    el.innerHTML='<div class="speed-empty">Sin sesiones de cronómetro aún.<br>Usá el tab <strong>⏲ Cronómetro</strong> en el panel Pomodoro para registrar velocidad por tema.</div>';
    return;
  }
  // Agrupar por tema
  const byTopic={};
  sessions.forEach(s=>{
    const key=s.topicId;
    if(!byTopic[key])byTopic[key]={
      topicId:key,course:s.course,topic:s.topic,
      secs:0,total:0,easy:0,hard:0,skipped:0,failed:0,sessions:0,lastDate:s.date
    };
    const t=byTopic[key];
    t.secs+=s.secs;
    t.total+=(s.easy+s.hard+s.skipped+s.failed);
    t.easy+=s.easy;t.hard+=s.hard;t.skipped+=s.skipped;t.failed+=s.failed;
    t.sessions++;
    if(s.date>t.lastDate)t.lastDate=s.date;
  });

  // Calcular métricas y clasificar
  const rows=Object.values(byTopic).map(t=>{
    const aciertos=t.easy+t.hard;
    const acc=t.total?Math.round(aciertos/t.total*100):0;
    const skip=t.total?Math.round(t.skipped/t.total*100):0;
    const tpp=t.total?Math.round(t.secs/t.total):0;
    const target=getSpeedTarget(t.course);
    const ratio=target?tpp/target:1;

    // Clasificar
    let cat='ok',catLabel='✓ dominado';
    if(acc<60){
      cat='bad';catLabel='🔴 a teoría';
    }else if(skip>=20){
      cat='fake';catLabel='🟡 saltás mucho';
    }else if(ratio>1.3){
      cat='slow';catLabel='⚠ velocidad';
    }
    return{...t,acc,skip,tpp,target,ratio,cat,catLabel};
  }).sort((a,b)=>a.acc-b.acc);

  // Render
  let html='<div class="speed-row head">'
    +'<span>Tema</span>'
    +'<span class="speed-num">Acierto</span>'
    +'<span class="speed-num">Tiempo/prob</span>'
    +'<span class="speed-num">Skip</span>'
    +'<span style="text-align:center">Estado</span>'
    +'</div>';
  html+=rows.map(r=>{
    const shortTopic=r.topic.replace(/^Cap\.\s*/,'').substring(0,32);
    const targetTxt=Math.round(r.target)+'s';
    const tppTxt=r.tpp+'s';
    const tppColor=r.ratio>1.3?'var(--accent4)':(r.ratio<0.8?'var(--accent3)':'var(--text)');
    const accColor=r.acc>=80?'var(--accent3)':(r.acc>=60?'var(--accent4)':'var(--accent2)');
    const skipColor=r.skip>=20?'#f0a500':(r.skip>=10?'var(--accent4)':'var(--muted)');
    return'<div class="speed-row" title="'+r.course+' · '+r.topic+'\n'+r.sessions+' sesión(es) · target '+targetTxt+'/prob">'
      +'<span class="speed-name">'+shortTopic+'</span>'
      +'<span class="speed-num" data-label="Acierto" style="color:'+accColor+'">'+r.acc+'%</span>'
      +'<span class="speed-num" data-label="Tiempo" style="color:'+tppColor+'">'+tppTxt+'</span>'
      +'<span class="speed-num" data-label="Skip" style="color:'+skipColor+'">'+r.skip+'%</span>'
      +'<span class="speed-cat '+r.cat+'">'+r.catLabel+'</span>'
      +'</div>';
  }).join('');

  // Resumen arriba
  const totalSess=sessions.length;
  const totalProbs=rows.reduce((a,r)=>a+r.total,0);
  const avgAcc=rows.length?Math.round(rows.reduce((a,r)=>a+r.acc*r.total,0)/Math.max(1,totalProbs)):0;
  const problemas=rows.filter(r=>r.cat!=='ok').length;

  html='<div style="display:flex;flex-wrap:wrap;gap:.6rem;font-size:.68rem;color:var(--muted);margin-bottom:.6rem;padding:.4rem .6rem;background:var(--bg);border-radius:4px">'
    +'<span>📊 <b style="color:var(--text)">'+totalSess+'</b> sesiones</span>'
    +'<span>🧩 <b style="color:var(--text)">'+totalProbs+'</b> problemas</span>'
    +'<span>🎯 Acierto prom: <b style="color:'+(avgAcc>=70?'var(--accent3)':'var(--accent4)')+'">'+avgAcc+'%</b></span>'
    +(problemas?'<span style="color:#f0a500">⚠ <b>'+problemas+'</b> tema'+(problemas===1?'':'s')+' con problemas</span>':'<span style="color:var(--accent3)">✓ Todos en verde</span>')
    +'</div>'
    +html;

  el.innerHTML=html;
}
/* Helper: encuentra el topicId dado curso y nombre de tema */
function findTopicIdByCourseAndName(course, name){
  if(!TOPICS[course])return null;
  for(const [id, tname] of Object.entries(TOPICS[course])){
    if(tname===name)return id;
  }
  return null;
}

/* Actualiza los íconos de dependencia sin re-renderizar todo el plan */
function refreshPlanIcons(){
  document.querySelectorAll('.ti[data-id]').forEach(el=>{
    const id=el.dataset.id;
    const course=getTopic(id).course;
    const info=getTopicDependencyInfo(id);
    let badge=el.querySelector('.dep-badge');

    // Si ya no aplica ningún ícono, borrarlo
    if(!info.blocked && !info.isBottleneck){
      if(badge)badge.remove();
      return;
    }

    // Determinar qué mostrar
    let icon='', cls='', title='';
    if(info.blocked){
      icon='🔒'; cls='blocked';
      const names=info.weakPrereqs.map(p=>TOPICS[course]?.[p]||p).join(', ');
      title='🔒 Bloqueado — prereq débil: '+names;
    } else {
      icon='🎯'; cls='bottleneck';
      title='🎯 Cuello de botella — '+info.dependents.length+' dependientes';
    }

    if(badge){
      badge.className='dep-badge '+cls;
      badge.textContent=icon;
      badge.title=title;
    } else {
      const tn=el.querySelector('.tn');
      if(tn){
        const span=document.createElement('span');
        span.className='dep-badge '+cls;
        span.textContent=icon;
        span.title=title;
        span.onclick=(e)=>{e.stopPropagation();showDepInfo(id);};
        tn.after(span);
      }
    }
  });
}
/* ═══ CALIBRACIÓN METACOGNITIVA ═══ */

function renderCalibration(){
  const el=document.getElementById('calibrationBox');
  if(!el)return;
  const data=S.calibration||[];

  if(data.length<20){
    el.innerHTML='<div class="speed-empty">Necesitás al menos <b>20</b> respuestas para que el Brier sea estable.<br>Llevas <b>'+data.length+'</b>. El número que ves es ruido.</div>';
    return;
  }

  // ── Brier score global ──
  // Brier = promedio de (confianza/100 - (acierto?1:0))²
  // 0 = perfecto, 0.25 = aleatorio, 0.5+ = peor que adivinar
  let brierSum=0;
  data.forEach(r=>{
    const c=(r.confidence||60)/100;
    const a=r.correct?1:0;
    brierSum+=Math.pow(c-a,2);
  });
  const brier=(brierSum/data.length).toFixed(3);
  const lowSample=data.length<50;

  // ── Confianza promedio vs acierto promedio (global) ──
  const avgConf=data.reduce((a,r)=>a+(r.confidence||60),0)/data.length;
  const avgAcc=data.filter(r=>r.correct).length/data.length*100;
  const biasGlobal=Math.round(avgConf-avgAcc);

  // ── Por tema ──
  const byTopic={};
  data.forEach(r=>{
    const key=r.topicId||r.course||'otros';
    if(!byTopic[key])byTopic[key]={
      course:r.course, topic:r.topic, topicId:r.topicId,
      confSum:0, correct:0, total:0, highConfFails:0
    };
    byTopic[key].confSum+=r.confidence||60;
    byTopic[key].correct+=r.correct?1:0;
    byTopic[key].total++;
    if((r.confidence||60)>=80 && !r.correct)byTopic[key].highConfFails++;
  });

  const rows=Object.values(byTopic).map(t=>{
    const confAvg=Math.round(t.confSum/t.total);
    const acc=Math.round(t.correct/t.total*100);
    const bias=confAvg-acc;
    let cat='ok', label='✓ calibrado';
    if(bias>=20){cat='over';label='🔴 sobreconfianza';}
    else if(bias<=-20){cat='under';label='🟡 subconfianza';}
    return{...t,confAvg,acc,bias,cat,label};
  }).filter(r=>r.total>=3)
    .sort((a,b)=>Math.abs(b.bias)-Math.abs(a.bias));

  // ── Resumen ──
  let html='<div style="display:flex;flex-wrap:wrap;gap:.6rem;font-size:.68rem;color:var(--muted);margin-bottom:.6rem;padding:.4rem .6rem;background:var(--bg);border-radius:4px">'
    +'<span>📊 <b style="color:var(--text)">'+data.length+'</b> respuestas</span>'
    +'<span>🎯 Brier: <b style="color:'+(brier<=0.15?'var(--accent3)':brier<=0.25?'var(--accent4)':'var(--accent2)')+'">'+brier+'</b> <span style="opacity:.6">(menor=mejor)</span>'+(lowSample?' <span style="color:#f0a500">· muestra baja</span>':'')+'</span>'
    +'<span>📈 Confianza prom: <b style="color:var(--text)">'+Math.round(avgConf)+'%</b></span>'
    +'<span>✓ Acierto prom: <b style="color:var(--text)">'+Math.round(avgAcc)+'%</b></span>'
    +'<span style="color:'+(Math.abs(biasGlobal)>15?'#f0a500':'var(--accent3)')+'">Bias: <b>'+(biasGlobal>0?'+':'')+biasGlobal+'</b></span>'
    +'</div>';

  if(!rows.length){
    html+='<div class="speed-empty">Necesitás al menos 3 respuestas por tema para diagnosticar.</div>';
    el.innerHTML=html;
    return;
  }

  html+='<div class="speed-row head">'
    +'<span>Tema</span>'
    +'<span class="speed-num">Conf.</span>'
    +'<span class="speed-num">Acierto</span>'
    +'<span class="speed-num">Bias</span>'
    +'<span style="text-align:center">Estado</span>'
    +'</div>';

  rows.forEach(r=>{
    const shortTopic=(r.topic||'—').replace(/^Cap\.\s*/,'').substring(0,32);
    const biasColor=r.bias>=20?'var(--accent2)':r.bias<=-20?'#f0a500':'var(--muted)';
    const biasTxt=(r.bias>0?'+':'')+r.bias;
    html+='<div class="speed-row" title="'+r.course+' · '+r.topic+'\nFallos con alta confianza: '+r.highConfFails+'">'
      +'<span class="speed-name">'+shortTopic+'</span>'
      +'<span class="speed-num">'+r.confAvg+'%</span>'
      +'<span class="speed-num">'+r.acc+'%</span>'
      +'<span class="speed-num" style="color:'+biasColor+'">'+biasTxt+'</span>'
      +'<span class="speed-cat '+(r.cat==='over'?'bad':r.cat==='under'?'slow':'ok')+'">'+r.label+'</span>'
      +'</div>';
  });

  // ── Zona ciega: fallos con alta confianza ──
  const blindSpots=data.filter(r=>(r.confidence||60)>=80 && !r.correct);
  if(blindSpots.length){
    // Persistir topics ciegos para el triage prioritario
    if(!S.blindSpots)S.blindSpots={};
    const todayStr=today();
    blindSpots.forEach(r=>{
      const key=r.topicId||r.course||'otros';
      if(!S.blindSpots[key]){
        S.blindSpots[key]={addedAt:todayStr,cleared:false,hits:3};
      } else if(S.blindSpots[key].cleared){
        // Reabrir SOLO si el fallo actual es posterior al clearedAt
        const clearedAt=S.blindSpots[key].clearedAt;
        if(!clearedAt || (r.date && r.date > clearedAt)){
          S.blindSpots[key].cleared=false;
          S.blindSpots[key].hits=3;
          S.blindSpots[key].addedAt=todayStr;
        }
      }
    });
    save();

    const activeBlind=Object.keys(S.blindSpots).filter(k=>!S.blindSpots[k].cleared).length;
    html+='<div style="margin-top:.7rem;padding:.5rem .7rem;background:#1f0a0f;border-left:3px solid var(--accent2);border-radius:4px">'
      +'<div style="font-size:.68rem;color:var(--accent2);font-weight:700;margin-bottom:.3rem;text-transform:uppercase;letter-spacing:.05em">⚠ Zona ciega — creías saber y fallaste ('+blindSpots.length+')</div>'
      +'<div style="font-size:.68rem;color:var(--muted);line-height:1.5;margin-bottom:.5rem">Estos son los temas que MÁS te van a doler en el examen. No los estudiás porque creés que los sabés.</div>'
      +'<button onclick="startBlindSpotTriage()" style="padding:.35rem .7rem;background:var(--accent2);color:#000;border:none;border-radius:4px;cursor:pointer;font-family:inherit;font-size:.68rem;font-weight:700">⚡ Triage de zona ciega ('+activeBlind+' tema'+(activeBlind===1?'':'s')+')</button>'
      +'</div>';
  }

  el.innerHTML=html;
}


/* ═══ BADGE DE VELOCIDAD EN EL PLAN ═══ */
function renderTopicSpeed(id){
  const el=document.querySelector('[data-id="'+id+'"]');if(!el)return;
  const t=(S.t||{})[id]||{};
  let badge=el.querySelector('.topic-speed-badge');
  if(!t.speedSecs||!t.speedProbs){
    if(badge)badge.remove();
    return;
  }
  const avg=Math.round(t.speedSecs/t.speedProbs);
  const course=getTopic(id).course;
  const target=typeof getSpeedTarget!=='undefined'?getSpeedTarget(course):120;
  const ratio=avg/target;
  const color=ratio<0.8?'var(--accent3)':ratio<1.3?'var(--muted)':'var(--accent4)';
  const icon=ratio<0.8?'⚡':ratio<1.3?'⏱':'🐢';
  if(!badge){
    badge=document.createElement('span');
    badge.className='topic-speed-badge';
    const tn=el.querySelector('.tn');
    if(tn)tn.appendChild(badge);else return;
  }
  badge.textContent=icon+' '+avg+'s';
  badge.title='Velocidad: '+avg+'s/problema · target '+target+'s · '+t.speedProbs+' problemas resueltos';
  badge.style.cssText='font-size:.64rem;color:'+color+';border:1px solid '+color+'40;padding:.02rem .22rem;margin-left:.3rem;white-space:nowrap;vertical-align:middle;cursor:default;font-family:"DM Mono",monospace';
}

function renderAllTopicSpeeds(){
  document.querySelectorAll('.ti[data-id]').forEach(el=>renderTopicSpeed(el.dataset.id));
}
/* ═══ MODAL GENÉRICO ═══ */
function showModal(title,bodyHTML,opts){
  opts=opts||{};
  // Remover uno anterior si existe
  document.getElementById('_genModal')?.remove();
  const m=document.createElement('div');
  m.id='_genModal';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:3000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .2s ease';
  m.onclick=(e)=>{if(e.target===m)closeModal();};
  const accent=opts.accent||'var(--accent)';
  const icon=opts.icon||'';
  m.innerHTML=`
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.4rem 1.5rem;max-width:460px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6)">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.9rem;border-bottom:1px solid var(--border);padding-bottom:.7rem">
        ${icon?`<span style="font-size:1.1rem">${icon}</span>`:''}
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;color:${accent};flex:1">${title}</div>
        <button onclick="closeModal()" style="background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;border-radius:4px;font-size:.78rem;padding:.1rem .35rem;line-height:1">✕</button>
      </div>
      <div style="font-size:.78rem;color:var(--text);line-height:1.6">${bodyHTML}</div>
      ${opts.noButton?'':`<button onclick="closeModal()" style="margin-top:1rem;width:100%;padding:.5rem;background:${accent};color:#000;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.6rem;font-weight:700">${opts.buttonText||'Entendido'}</button>`}
    </div>`;
  document.body.appendChild(m);
}
function closeModal(){document.getElementById('_genModal')?.remove();}

/* Alias para no romper el código viejo */
function showAlert(msg,opts){
  // Convierte saltos de línea en <br>
  const html=String(msg).replace(/\n/g,'<br>');
  showModal((opts&&opts.title)||'Aviso',html,opts);
}
/* ═══ EDITOR DE TARGETS DE VELOCIDAD ═══ */
function renderSpeedTargetsEditor(){
  const el=document.getElementById('speedTargetsEdit');
  if(!el)return;
  el.innerHTML=Object.keys(SPEED_TARGETS_DEFAULT).map(c=>{
    const v=getSpeedTarget(c);
    return '<label style="display:flex;align-items:center;gap:.3rem;font-size:.68rem;color:var(--muted)">'
      +'<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+c+'">'+c+'</span>'
      +'<input type="number" value="'+v+'" min="30" max="600" onchange="setSpeedTarget(\''+c+'\',this.value)" style="width:48px;background:#0a0a0f;border:1px solid var(--border);color:var(--text);padding:.15rem .25rem;font-family:inherit;font-size:.68rem;text-align:center;border-radius:3px">'
      +'</label>';
  }).join('');
}
function setSpeedTarget(course,val){
  if(!S.speedTargets)S.speedTargets={};
  const n=Math.max(30,Math.min(600,parseInt(val)||120));
  S.speedTargets[course]=n;
  save();
  renderSpeedStats();
  if(typeof renderAllTopicSpeeds==='function')renderAllTopicSpeeds();

}
// ═══ SYNC CON GIST DE GITHUB ═══
const SYNC_KEY='uni-sync-config';
function getSyncConfig(){try{return JSON.parse(localStorage.getItem(SYNC_KEY)||'{}');}catch(e){return{};}}
function setSyncConfig(c){localStorage.setItem(SYNC_KEY,JSON.stringify(c));}
function hasSyncConfig(){const c=getSyncConfig();return !!(c.token&&c.gistId);}
let _syncDebounce=null;

function schedulePush(){
  if(!hasSyncConfig())return;
  clearTimeout(_syncDebounce);
_syncDebounce=setTimeout(()=>pushToCloud(),30000);
}

async function pushToCloud(){
  const cfg=getSyncConfig();
  if(!cfg.token||!cfg.gistId)return;
  updateSyncStatusUI('syncing','subiendo...');
  try{
    const res=await fetch('https://api.github.com/gists/'+cfg.gistId,{
      method:'PATCH',
      headers:{
        'Authorization':'token '+cfg.token,
        'Content-Type':'application/json',
        'Accept':'application/vnd.github+json'
      },
      body:JSON.stringify({files:{'uni-state.json':{content:JSON.stringify(S)}}})
    });
    if(!res.ok)throw new Error('HTTP '+res.status);
    updateSyncStatusUI('ok','sync '+new Date().toLocaleTimeString('es-PE'));
  }catch(e){
    updateSyncStatusUI('error','falló: '+e.message);
  }
}

async function pullFromCloud(opts){
  opts=opts||{};
  const cfg=getSyncConfig();
  if(!cfg.token||!cfg.gistId){
    if(opts.notify)showToast('Configurá el sync primero.');
    return false;
  }
  updateSyncStatusUI('syncing','bajando...');
  try{
    const res=await fetch('https://api.github.com/gists/'+cfg.gistId,{
      headers:{'Authorization':'token '+cfg.token,'Accept':'application/vnd.github+json'},
      cache:'no-store'
    });
    if(!res.ok)throw new Error('HTTP '+res.status);
    const data=await res.json();
    const file=data.files['uni-state.json'];
    if(!file||!file.content||file.content.trim()==='{}'){
      if(opts.notify)showToast('El gist está vacío. Subiendo estado local...');
      await pushToCloud();
      return true;
    }
    const remote=JSON.parse(file.content);
    const localTs=S._savedAt||0;
    const remoteTs=remote._savedAt||0;
    if(remoteTs>localTs){
      S=remote;
      localStorage.setItem(KEY,JSON.stringify(S));
      updateSyncStatusUI('ok','aplicando remoto...');
      if(opts.notify)showToast('Estado remoto aplicado. Recargando...');
      location.reload();
      return true;
    }else{
      await pushToCloud();
      if(opts.notify)showToast('Tu estado local es más reciente. Subido al gist.');
      return true;
    }
  }catch(e){
    updateSyncStatusUI('error','falló: '+e.message);
    if(opts.notify)showToast('Error: '+e.message);
    return false;
  }
}

function clearSyncConfig(){
  if(!confirm('¿Borrar configuración de sync? El token vive aparte del backup, así que no se pierde nada más.'))return;
  localStorage.removeItem(SYNC_KEY);
  updateSyncStatusUI('idle','sin configurar');
}
function updateSyncStatusUI(state,msg){
  const el=document.getElementById('cfgSyncDot');
  const icons={idle:'○',syncing:'⟳',ok:'●',error:'⚠'};
  const colors={idle:'var(--muted)',syncing:'var(--accent4)',ok:'var(--accent3)',error:'var(--accent2)'};
  if(el){
    el.textContent=icons[state];
    el.style.color=colors[state];
    el.title=msg||'';
  }
  const panelStatus=document.getElementById('cfgSyncStatus');
  if(panelStatus){
    const t=msg||icons[state];
    panelStatus.innerHTML='<span style="color:'+colors[state]+'">'+icons[state]+'</span> '+t;
  }
}

function openConfigPanel(){
  document.getElementById('_cfgPanel')?.remove();
  const cfg=getSyncConfig();
  const hasIA=hasGroqApiKey();
  const curModel=localStorage.getItem('uni-groq-model')||'';

  const m=document.createElement('div');
  m.id='_cfgPanel';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:3000;display:flex;align-items:center;justify-content:center;padding:1rem';
  m.onclick=(e)=>{if(e.target===m)closeConfigPanel();};

  const sectionTitle=(icon,txt,first)=>{
    return '<div style="font-size:.70rem;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;font-weight:700;margin-bottom:.6rem;'+(first?'':'border-top:1px solid var(--border);padding-top:1rem;margin-top:.4rem')+'">'+icon+' '+txt+'</div>';
  };

  m.innerHTML=`
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;max-width:560px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6)">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;border-bottom:1px solid var(--border);padding-bottom:.7rem">
        <span style="font-size:1.2rem">⚙</span>
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;color:var(--accent);flex:1">Configuración</div>
        <button onclick="closeConfigPanel()" style="background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;border-radius:4px;font-size:.8rem;padding:.15rem .4rem;line-height:1">✕</button>
      </div>

      ${sectionTitle('☁','Sincronización (GitHub Gist)',true)}

      <div id="cfgSyncStatus" style="padding:.5rem .7rem;background:var(--bg);border-radius:6px;font-size:.70rem;color:var(--muted);margin-bottom:.7rem;line-height:1.5">
        ${(cfg.token&&cfg.gistId)?'● Configurado':'○ Sin configurar'}
      </div>

      <label style="display:block;font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.25rem">Token de GitHub (classic, scope: gist)</label>
      <input type="password" id="_cfgToken" value="${(cfg.token||'').replace(/"/g,'&quot;')}" placeholder="ghp_..." style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.45rem .55rem;font-family:'DM Mono',monospace;font-size:.70rem;border-radius:4px;outline:none;margin-bottom:.5rem">

      <label style="display:block;font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.25rem">Gist ID</label>
      <input type="text" id="_cfgGist" value="${(cfg.gistId||'').replace(/"/g,'&quot;')}" placeholder="abc123..." style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.45rem .55rem;font-family:'DM Mono',monospace;font-size:.70rem;border-radius:4px;outline:none;margin-bottom:.5rem">

      <div style="font-size:.68rem;color:var(--muted);line-height:1.5;margin-bottom:.6rem;padding:.5rem .6rem;background:var(--bg);border-radius:4px">
        <strong style="color:var(--text)">Setup:</strong> token classic (<code style="background:var(--card);padding:.05rem .25rem;border-radius:2px">github.com/settings/tokens</code>, marcá solo <code style="background:var(--card);padding:.05rem .25rem;border-radius:2px">gist</code>) + gist secreto con archivo <code style="background:var(--card);padding:.05rem .25rem;border-radius:2px">uni-state.json</code> que contenga <code style="background:var(--card);padding:.05rem .25rem;border-radius:2px">{}</code>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:.4rem">
        <button onclick="cfgSaveSync()" style="padding:.5rem;background:var(--accent);color:#000;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem;font-weight:700">💾 Guardar</button>
        <button onclick="cfgTestSync()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">🔍 Probar</button>
        <button onclick="pullFromCloud({notify:true})" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">⬇ Bajar</button>
        <button onclick="pushToCloud()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">⬆ Subir</button>
      </div>

      <button onclick="cfgClearSync()" style="width:100%;padding:.35rem;background:transparent;border:1px solid #4a1a1a;color:var(--accent2);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.68rem">✕ Borrar config de sync</button>

      ${sectionTitle('🤖','IA (Groq)')}

      <div id="cfgIAStatus" style="padding:.5rem .7rem;background:var(--bg);border-radius:6px;font-size:.70rem;color:var(--muted);margin-bottom:.7rem;line-height:1.5">
        ${hasIA?'● API key configurada'+(curModel?' · modelo: <strong>'+curModel+'</strong>':''):'○ Sin configurar'}
      </div>

      <label style="display:block;font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.25rem">API Key (console.groq.com/keys)</label>
      <input type="password" id="_cfgIAKey" value="${(getGroqApiKey()||'').replace(/"/g,'&quot;')}" placeholder="gsk_..." style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.45rem .55rem;font-family:'DM Mono',monospace;font-size:.70rem;border-radius:4px;outline:none;margin-bottom:.5rem">

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
        <button onclick="cfgSaveIA()" style="padding:.5rem;background:var(--accent3);color:#000;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem;font-weight:700">💾 Guardar key</button>
        <button onclick="openAIConfig()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">🔍 Elegir modelo</button>
      </div>

      ${sectionTitle('💾','Backup manual (WhatsApp)')}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
        <button onclick="exportForSync()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">📤 Exportar</button>
        <button onclick="document.getElementById('syncfile').click()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">📥 Importar</button>
      </div>

      ${sectionTitle('🛠','Herramientas')}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
        <button onclick="window.print();closeConfigPanel()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">🖨 Imprimir plan</button>
        <button onclick="printActiveWeek();closeConfigPanel()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">🖨 Semana activa</button>
        <button onclick="exportTxt()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">📄 Resumen TXT</button>
        <button onclick="toggleTheme()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">◐ Tema claro/oscuro</button>
      </div>

      ${sectionTitle('🎨','Personalización del tema')}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
        <button onclick="openThemeConfig()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">🎨 Configurar colores</button>
        <button onclick="resetTheme()" style="padding:.5rem;background:transparent;border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-family:inherit;font-size:.70rem">↺ Resetear tema</button>
      </div>

      <div id="cfgSyncHint" style="font-size:.66rem;color:var(--muted);margin-top:1rem;line-height:1.4;text-align:center"></div>
    </div>`;

  document.body.appendChild(m);

  const hintEl=document.getElementById('cfgSyncHint');
  if(hintEl){
    const t=S._savedAt?new Date(S._savedAt).toLocaleString('es-PE'):'nunca';
    hintEl.textContent='Último guardado local: '+t;
  }
}

function closeConfigPanel(){
  document.getElementById('_cfgPanel')?.remove();
}

function cfgSaveSync(){
  const token=(document.getElementById('_cfgToken')?.value||'').trim();
  const gistId=(document.getElementById('_cfgGist')?.value||'').trim();
  if(!token||!gistId){showToast('Completá los dos campos','error');return;}
  if(!token.startsWith('ghp_')){
    showToast('El token debe empezar con ghp_ (classic, no fine-grained)','error');
    return;
  }
  setSyncConfig({token,gistId});
  updateSyncStatusUI('syncing','probando...');
  showToast('Guardado. Probando conexión...','success');
  pullFromCloud({notify:true});
}

function cfgTestSync(){
  const c=getSyncConfig();
  if(!c.token||!c.gistId){showToast('Guardá primero','error');return;}
  pullFromCloud({notify:true});
}

function cfgClearSync(){
  if(!confirm('¿Borrar la configuración de sync de este dispositivo?\n\nEl gist en GitHub no se toca.'))return;
  localStorage.removeItem(SYNC_KEY);
  updateSyncStatusUI('idle','sin configurar');
  closeConfigPanel();
  showToast('Config de sync borrada','success');
}

function cfgSaveIA(){
  const key=(document.getElementById('_cfgIAKey')?.value||'').trim();
  if(!key){showToast('Pegá la API key','error');return;}
  if(!key.startsWith('gsk_')){
    showToast('La API key de Groq debe empezar con gsk_','error');
    return;
  }
  setGroqApiKey(key);
  showToast('API key guardada','success');
  const st=document.getElementById('cfgIAStatus');
  if(st)st.innerHTML='● API key configurada';
}
// ═══ FIN SYNC ═══
// ═══════════════════════════════════════════════════════════════
// EDITOR DE HORARIO — drag & drop + touch
// ═══════════════════════════════════════════════════════════════
let _schedEditMode = false;

function getSchedTpl(kind){
  if(S.schedTpl && S.schedTpl[kind]) return S.schedTpl[kind];
  return kind==='odd' ? SCHEDULE_ODD : SCHEDULE_EVEN;
}
function ensureSchedTpl(kind){
  if(!S.schedTpl) S.schedTpl={};
  if(!S.schedTpl[kind]){
    const src = kind==='odd' ? SCHEDULE_ODD : SCHEDULE_EVEN;
    S.schedTpl[kind] = src.map(r=>[...r]);
  }
  return S.schedTpl[kind];
}
function resetSchedTpl(){
  if(!S.schedTpl) return;
  if(!confirm('¿Volver al horario original? Se pierden los cambios.')) return;
  S.schedTpl = {};
  save();
  renderStudySchedule();
  showToast('✓ Horario restablecido','success');
}
function toggleSchedEdit(){
  _schedEditMode = !_schedEditMode;
  renderStudySchedule();
  const btn = document.getElementById('schedEditBtn');
  if(btn){
    btn.textContent = _schedEditMode ? '✓ Terminar edición' : '✎ Editar horario';
    btn.classList.toggle('active', _schedEditMode);
  }
  const hint = document.getElementById('schedEditHint');
  if(hint){
    hint.textContent = _schedEditMode
      ? 'Arrastrá los bloques para reorganizar tu horario. Los cambios aplican a todas las semanas del mismo tipo.'
      : 'Arrastrá bloques para reorganizar tu horario.';
  }
}


let _schedDragSrc = null;
let _schedTouchSrc = null;
let _schedGhost = null;
let _schedDropTarget = null;
function attachScheduleDragHandlers(root){
  root.querySelectorAll('.sg-cell').forEach(cell=>{
    const row = Number(cell.dataset.row);
    const dow = Number(cell.dataset.dow);
    const item = cell.dataset.item;

    // Click normal → toggle check (fuera de modo edición)
    if(cell.dataset.hasCheck === '1'){
      cell.addEventListener('click', e=>{
        if(_schedEditMode) return;
        if(cell.dataset.justDragged === '1'){ delete cell.dataset.justDragged; return; }
        toggleScheduleCheck(cell.dataset.key);
      });
    }

    if(cell.draggable){
      // Drag nativo (mouse)
      cell.addEventListener('dragstart', e=>{
        _schedDragSrc = { row, dow, kind: cell.dataset.kind };
        e.dataTransfer.setData('text/plain', JSON.stringify(_schedDragSrc));
        e.dataTransfer.effectAllowed = 'move';
        cell.classList.add('dragging');
      });
      cell.addEventListener('dragend', ()=>{
        cell.classList.remove('dragging');
        root.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
        cell.dataset.justDragged = '1';
        setTimeout(()=>{ delete cell.dataset.justDragged; }, 50);
      });

      // Touch (celular)
      cell.addEventListener('contextmenu', e=>e.preventDefault());

      cell.addEventListener('touchstart', e=>{
        if(!_schedEditMode) return;
        const t = e.touches[0];
        _schedTouchSrc = { row, dow, kind: cell.dataset.kind };
        cell.classList.add('dragging');
        _schedGhost = cell.cloneNode(true);
        _schedGhost.style.cssText =
          'position:fixed;pointer-events:none;z-index:9999;opacity:.85;'+
          'width:'+cell.offsetWidth+'px;height:'+cell.offsetHeight+'px;'+
          'left:'+(t.clientX-cell.offsetWidth/2)+'px;'+
          'top:'+(t.clientY-cell.offsetHeight/2)+'px;'+
          'border:2px solid var(--accent);border-radius:4px;background:var(--card);'+
          'display:flex;align-items:center;justify-content:center;font-size:.70rem';
        document.body.appendChild(_schedGhost);
      }, {passive:true});

      cell.addEventListener('touchmove', e=>{
        if(!_schedTouchSrc || !_schedGhost) return;
        e.preventDefault();
        const t = e.touches[0];
        _schedGhost.style.left = (t.clientX - _schedGhost.offsetWidth/2) + 'px';
        _schedGhost.style.top  = (t.clientY - _schedGhost.offsetHeight/2) + 'px';
        _schedGhost.style.display = 'none';
        const under = document.elementFromPoint(t.clientX, t.clientY);
        _schedGhost.style.display = '';
        const target = under?.closest('.sg-cell');
        document.querySelectorAll('.sg-cell.drag-over').forEach(el=>el.classList.remove('drag-over'));
        if(target && target !== cell && target.dataset.kind === _schedTouchSrc.kind){
          target.classList.add('drag-over');
          _schedDropTarget = {
            row: Number(target.dataset.row),
            dow: Number(target.dataset.dow),
            kind: target.dataset.kind
          };
        } else {
          _schedDropTarget = null;
        }
      }, {passive:false});

      cell.addEventListener('touchend', e=>{
        if(!_schedTouchSrc) return;
        const src = _schedTouchSrc;
        _schedTouchSrc = null;
        cell.classList.remove('dragging');
        if(_schedGhost){ _schedGhost.remove(); _schedGhost = null; }
        document.querySelectorAll('.sg-cell.drag-over').forEach(el=>el.classList.remove('drag-over'));
        if(_schedDropTarget){
          const t = _schedDropTarget;
          _schedDropTarget = null;
          if(t.kind === src.kind && !(t.row === src.row && t.dow === src.dow)){
            swapScheduleCells(src, t);
          }
        }
      });
    }

    // Drop targets (mouse)
    if(dow !== 6 && item !== 'Dormir'){
      cell.addEventListener('dragover', e=>{
        if(!_schedEditMode || !_schedDragSrc) return;
        if(_schedDragSrc.kind !== cell.dataset.kind) return;
        if(_schedDragSrc.row === row && _schedDragSrc.dow === dow) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        cell.classList.add('drag-over');
      });
      cell.addEventListener('dragleave', ()=>{
        cell.classList.remove('drag-over');
      });
      cell.addEventListener('drop', e=>{
        e.preventDefault();
        cell.classList.remove('drag-over');
        if(!_schedEditMode || !_schedDragSrc) return;
        const src = _schedDragSrc;
        _schedDragSrc = null;
        if(src.kind !== cell.dataset.kind) return;
        if(src.row === row && src.dow === dow) return;
        swapScheduleCells(src, { row, dow, kind: cell.dataset.kind });
      });
    }
  });
}

function swapScheduleCells(a, b){
  const tpl = ensureSchedTpl(a.kind);
  const tmp = tpl[a.row][a.dow];
  tpl[a.row][a.dow] = tpl[b.row][b.dow];
  tpl[b.row][b.dow] = tmp;
  save();
  renderStudySchedule();
}
// ── INIT ──
buildWeeklyStudyPlan();renderPlanTopics();loadThemePreference();loadCustomTheme();refreshCourseRGB();
(async()=>{
  await load();
  // Cargar folder handle (IDB local, rápido) antes de render para que las imágenes del banco funcionen
  uniDirHandle=await loadDirHandle();
  if(uniDirHandle){
    document.getElementById('uniFolderStatus').textContent='✓ Seleccionada';
    document.getElementById('uniFolderStatus').style.color='var(--accent3)';
  }
  // Render inmediato con datos locales
  renderAll();initPomo();initChrono();initPWA();
  setPlanTab(S.planTab||'ciencias');
  const lastView=localStorage.getItem('uni-last-view')||'home';
  const homeBtn=document.getElementById('sb-home-btn');
  showView(lastView,lastView==='home'?homeBtn:document.querySelector('.sb-btn[onclick*="'+lastView+'"]'));
  const origSV=showView;
  window.showView=function(name,btn){origSV(name,btn);localStorage.setItem('uni-last-view',name);};
  // Sync en background — NO bloquea el render
  if(hasSyncConfig()){
    updateSyncStatusUI('syncing','sincronizando...');
    pullFromCloud({silent:true}).catch(()=>{});
  }else{
    updateSyncStatusUI('idle','sin configurar');
  }
})();
/* ═══ MODO TRIAGE DE NUEVAS v2 (60/día) ═══ */
let _fcTriQueue = [];
let _fcTriIdx = 0;
let _fcTriMode = 'new'; // 'new' | 'blind'

const TRI_CONFIG = {
  dailyLimit: 60,   // ← 60/día
  badDays: 2,       // ✗ no sé → +2 días
  okDays: 4,        // ~ más o menos → +4 días
  goodDays: 7       // ✓ lo sé → +7 días
};

function getTriDoneToday(){
  const t = today();
  if(!S.fcTriToday || S.fcTriToday.date !== t){
    S.fcTriToday = { date: t, done: 0 };
  }
  return S.fcTriToday.done;
}

function startFcTriage(){
  const done = getTriDoneToday();
  if(done >= TRI_CONFIG.dailyLimit){
    showToast('Ya triaste ' + done + ' hoy. Volvé mañana.');
    return;
  }

  const pool = (S.fc||[]).filter(c => c.state === 'new');
  if(!pool.length){
    showToast('No hay tarjetas nuevas para triage');
    return;
  }

  // Mezclar para evitar sesgo de orden
  for(let i = pool.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const remaining = TRI_CONFIG.dailyLimit - done;
  _fcTriMode = 'new';
  _fcTriQueue = pool.slice(0, remaining);
  _fcTriIdx = 0;

  const ov = document.getElementById('fcTriOverlay');
  if(ov) ov.style.display = 'flex';
  renderFcTri();
}

function renderFcTri(){
  const card = _fcTriQueue[_fcTriIdx];
  if(!card){
    const msg = _fcTriMode === 'blind'
      ? '✓ Zona ciega triada: ' + _fcTriQueue.length + ' tarjetas'
      : '✓ Triage completo: ' + _fcTriQueue.length + ' tarjetas';
    showToast(msg);
    exitFcTriage();
    return;
  }
  const doneToday = getTriDoneToday();
  const prog = document.getElementById('fcTriProgress');
  const courseEl = document.getElementById('fcTriCourse');
  const qEl = document.getElementById('fcTriQuestion');
  const limitEl = document.getElementById('fcTriLimit');

  if(prog) prog.textContent = (_fcTriIdx + 1) + ' / ' + _fcTriQueue.length;
  if(limitEl){
    if(_fcTriMode === 'blind'){
      limitEl.textContent = '🎯 zona ciega — sin límite';
      limitEl.style.color = 'var(--accent2)';
    } else {
      limitEl.textContent = 'hoy: ' + (doneToday + _fcTriIdx) + ' / ' + TRI_CONFIG.dailyLimit;
      limitEl.style.color = '';
    }
  }
  if(courseEl) courseEl.textContent = card.course + ' · ' + card.topic;
  if(qEl){
    qEl.textContent = card.q;
    renderMath(qEl);
  }
}
function startBlindSpotTriage(){
  const active = Object.entries(S.blindSpots||{}).filter(([k,v])=>!v.cleared);
  if(!active.length){ showToast('No hay zonas ciegas activas'); return; }

  const blindTopicIds = new Set();
  const blindCourses = new Set();
  active.forEach(([key])=>{
    if(/^[a-z]+\d+$/.test(key)) blindTopicIds.add(key);
    else blindCourses.add(key);
  });

  const pool = (S.fc||[]).filter(c => {
    if(blindCourses.has(c.course)) return true;
    const tid = findTopicIdByCourseAndName(c.course, c.topic);
    if(tid && blindTopicIds.has(tid)) return true;
    return false;
  });

  if(!pool.length){
    showToast('Sin flashcards en los temas de zona ciega. Creá algunas primero.');
    return;
  }

  for(let i = pool.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  _fcTriMode = 'blind';
  _fcTriQueue = pool;
  _fcTriIdx = 0;

  const ov = document.getElementById('fcTriOverlay');
  if(ov) ov.style.display = 'flex';
  renderFcTri();
}

function fcTri(level){
  const card = _fcTriQueue[_fcTriIdx];
  if(!card) return;

  const realCard = S.fc.find(c => c === card) ||
                   S.fc.find(c => c.q === card.q && c.a === card.a && c.course === card.course);
  if(!realCard){ _fcTriIdx++; renderFcTri(); return; }

  let mastery, intervalDays, ease;
  if(level === 'bad'){
    mastery = 20;
    intervalDays = TRI_CONFIG.badDays;
    ease = 2.4;
  } else if(level === 'ok'){
    mastery = 55;
    intervalDays = TRI_CONFIG.okDays;
    ease = 2.5;
  } else {
    mastery = 85;
    intervalDays = TRI_CONFIG.goodDays;
    ease = 2.6;
  }

  // Programar — todas a futuro, nunca el mismo día
  realCard.state = 'review';
  realCard.interval = intervalDays;
  realCard.due = localKey(new Date(Date.now() + intervalDays * 86400000));
  realCard.reps = 0;
  realCard.ease = ease;
  realCard.triagedAt = Date.now();
  realCard.triageLevel = level;

  // Actualizar dominio del tema
  const topicId = findTopicIdByCourseAndName(realCard.course, realCard.topic);
  if(topicId){
    const meta = ensureTopicMetadata(topicId);
    const current = meta.nivelDominio || 0;
    meta.nivelDominio = Math.round(current * 0.5 + mastery * 0.5);
    meta.fechaUltimoEstudio = today();
  }

  // Registrar en calibración metacognitiva
  if(!S.calibration) S.calibration = [];
  S.calibration.push({
    source: 'triage',
    topicId: topicId || null,
    course: realCard.course,
    topic: realCard.topic,
    confidence: level === 'bad' ? 25 : level === 'ok' ? 60 : 90,
    correct: level === 'good',
    rating: level,
    date: today(),
    ts: Date.now()
  });
  if(S.calibration.length > 2000) S.calibration = S.calibration.slice(-2000);

  // Modo blind: si acertaste, limpiar la zona ciega de ese tema
  if(_fcTriMode === 'blind' && level === 'good'){
    const key = topicId || realCard.course;
    if(S.blindSpots && S.blindSpots[key]){
      S.blindSpots[key].cleared = true;
      S.blindSpots[key].clearedAt = today();
    }
  }

  // Contador diario — SOLO en modo 'new'
  if(_fcTriMode === 'new'){
    const t = today();
    if(!S.fcTriToday || S.fcTriToday.date !== t){
      S.fcTriToday = { date: t, done: 0 };
    }
    S.fcTriToday.done++;
  }

  save();
  _fcTriIdx++;
  renderFcTri();
}

function exitFcTriage(){
  const ov = document.getElementById('fcTriOverlay');
  if(ov) ov.style.display = 'none';
  _fcTriQueue = [];
  _fcTriIdx = 0;
  _fcTriMode = 'new';
  save();
  renderFC();
  if(typeof refreshPlanIcons === 'function') refreshPlanIcons();
  if(typeof renderCalibration === 'function') renderCalibration();
  if(typeof renderHome === 'function') renderHome();
}

// Atajos de teclado
document.addEventListener('keydown', e => {
  const ov = document.getElementById('fcTriOverlay');
  if(!ov || ov.style.display === 'none') return;
  if(e.key === '1'){ fcTri('bad'); e.preventDefault(); }
  if(e.key === '2'){ fcTri('ok'); e.preventDefault(); }
  if(e.key === '3'){ fcTri('good'); e.preventDefault(); }
  if(e.key === 'Escape'){ exitFcTriage(); e.preventDefault(); }
});
function renderFCProjection(){
  const el=document.getElementById('fcProjection');
  if(!el)return;
  if(!S.fc||!S.fc.length){el.innerHTML='';return;}

  const days=[];
  for(let i=0;i<7;i++){
    const d=new Date();d.setDate(d.getDate()+i);
    const k=localKey(d);
    days.push({k,label:['L','M','X','J','V','S','D'][(d.getDay()+6)%7],count:0});
  }

  const t=today();
  const futureWindow=days.map(d=>d.k);

  S.fc.forEach(c=>{
    if(c.state==='new')return;
    const due=c.due||t;
    if(due<t){
      days[0].count++;
    } else if(futureWindow.includes(due)){
      const idx=futureWindow.indexOf(due);
      days[idx].count++;
    }
  });

  const max=Math.max(...days.map(d=>d.count),1);
  el.innerHTML=days.map((d,i)=>{
    const h=Math.max(4,Math.round(d.count/max*36));
    const col=i===0?'var(--accent2)':d.count>=max*0.8?'#f0a500':'var(--accent4)';
    const todayCol=i===0?'var(--accent2)':'var(--muted)';
    return'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">'
      +'<div style="font-size:.6rem;color:var(--muted)">'+d.count+'</div>'
      +'<div style="width:100%;height:'+h+'px;background:'+col+';border-radius:2px 2px 0 0;min-height:4px"></div>'
      +'<div style="font-size:.64rem;color:'+todayCol+';font-weight:'+(i===0?'700':'400')+'">'+d.label+'</div>'
      +'</div>';
  }).join('');
}
setInterval(()=>{
  const v=document.querySelector('.view.active')?.id;
  if(v==='view-home')renderHomeCapActual();
  else if(v==='view-plan'){updateRhythmProjection();renderHighLoadAlerts();renderPreOpReview();renderEnhancements();}
},60000);
/* ═══════════════════════════════════════════════════════════════
   FASE 1 — MODO SIMULACRO UNIFICADO
   ═══════════════════════════════════════════════════════════════ */

const SIM_COURSE_KEYS = {
  mate: [
    { key: '1', course: 'Trigonometría' },
    { key: '2', course: 'Geometría' },
    { key: '3', course: 'Aritmética' },
    { key: '4', course: 'Álgebra' }
  ],
  ciencias: [
    { key: '1', course: 'Física' },
    { key: '2', course: 'Química' }
  ],
  humanidades: [
    { key: '1', course: 'Raz. Verbal' },
    { key: '2', course: 'Raz. Matemático' },
    { key: '3', course: 'Lenguaje' },
    { key: '4', course: 'Historia Universal' },
    { key: '5', course: 'Historia del Perú' },
    { key: '6', course: 'Geografía' },
    { key: '7', course: 'Filosofía' },
    { key: '8', course: 'Literatura' },
    { key: '9', course: 'Inglés' }
  ],
  mixto: [
    { key: '1', course: 'Trigonometría', group: 'mate' },
    { key: '2', course: 'Geometría',      group: 'mate' },
    { key: '3', course: 'Aritmética',     group: 'mate' },
    { key: '4', course: 'Álgebra',        group: 'mate' },
    { key: '5', course: 'Física',         group: 'ciencias' },
    { key: '6', course: 'Química',        group: 'ciencias' },
    { key: '7', course: 'Raz. Verbal',    group: 'humanidades' },
    { key: '8', course: 'Raz. Matemático',group: 'humanidades' },
    { key: '9', course: 'Lenguaje',       group: 'humanidades' },
    { key: '0', course: 'Historia Universal', group: 'humanidades' }
  ]
};

const SIM_SKIP_REASONS = [
  { key: '1', icon: '🧠', label: 'No supe / me bloqueé',  tag: 'no_se' },
  { key: '2', icon: '⏱', label: 'No me dio el tiempo',   tag: 'tiempo' },
  { key: '3', icon: '📖', label: 'No entendí el enunciado', tag: 'lectura' },
  { key: '4', icon: '🎯', label: 'Estrategia (vuelvo luego)', tag: 'estrategia' }
];

const SIM_ERROR_TYPES = [
  { key: '1', icon: '🧠', label: 'Conceptual',      tag: 'conceptual' },
  { key: '2', icon: '📐', label: 'Procedimental',   tag: 'procedimental' },
  { key: '3', icon: '🔢', label: 'Cálculo',          tag: 'calculo' },
  { key: '4', icon: '📖', label: 'Lectura',          tag: 'lectura' },
  { key: '5', icon: '⚠',  label: 'Atención',         tag: 'atencion' }
];

let _simState = null;

function simExit(){
  if(_simState && _simState.preguntas.length > 0){
    if(!confirm('¿Salir sin guardar el simulacro? Se pierden las ' + _simState.preguntas.length + ' marcas.')) return;
  }
  if(_simState && _simState.timerInt) clearInterval(_simState.timerInt);
  _simState = null;
  document.getElementById('simOverlay').style.display = 'none';
  document.getElementById('simErrorScreen').style.display = 'none';
  document.getElementById('simConfigScreen').style.display = 'flex';
  document.getElementById('simCaptureScreen').style.display = 'none';
  const r = document.getElementById('simResultScreen');
  if(r){ r.style.display = 'none'; r.innerHTML = ''; }
}

function simStart(){
  const tipo = document.getElementById('simTipo').value;
  const duracion = parseInt(document.getElementById('simDuracion').value, 10) || 90;

  _simState = {
    tipo, duracionMin: duracion,
    startTs: Date.now(),
    timerInt: null,
    preguntas: [],
    cursoActual: null,
    temaActualIdx: 0,
    temasDisponibles: [],
    pendiente: null,
    errorPendiente: null
  };

  document.getElementById('simConfigScreen').style.display = 'none';
  document.getElementById('simCaptureScreen').style.display = 'flex';

  simRenderCourseKeys();
  simRenderResultKeys();
  simRenderStats();
  simRenderPreguntaNum();

  _simState.timerInt = setInterval(() => {
    const secs = Math.floor((Date.now() - _simState.startTs) / 1000);
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    const el = document.getElementById('simTimer');
    if(el) el.textContent = m + ':' + s;
  }, 500);
}

function simRenderPreguntaNum(){
  const el = document.getElementById('simPregNum');
  if(el) el.textContent = _simState.preguntas.length + 1;
}

function simRenderCourseKeys(){
  const container = document.getElementById('simCourseKeys');
  if(!container) return;
  const keys = SIM_COURSE_KEYS[_simState.tipo] || SIM_COURSE_KEYS.mixto;
  container.innerHTML = keys.map(k =>
    '<button data-course="' + k.course + '" onclick="simPickCourse(\'' + k.course + '\')" ' +
    'style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:.6rem .7rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.72rem;text-align:left;transition:border-color .15s">' +
    '<span style="display:inline-block;width:1.4rem;height:1.4rem;line-height:1.4rem;text-align:center;background:var(--bg);border-radius:3px;margin-right:.4rem;font-family:\'Syne\',sans-serif;font-weight:700;font-size:.72rem;color:var(--accent)">' + k.key + '</span>' +
    k.course + '</button>'
  ).join('');
  simHighlightActiveCourse();
}

function simHighlightActiveCourse(){
  document.querySelectorAll('#simCourseKeys button').forEach(b => {
    const active = b.dataset.course === _simState.cursoActual;
    b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    b.style.background = active ? 'rgba(99,102,241,.12)' : 'var(--card)';
  });
}

function simPickCourse(course){
  if(_simState.pendiente) return;
  _simState.cursoActual = course;
  const temas = Object.entries(TOPICS[course] || {}).map(([id, name]) => ({ id, name }));
  _simState.temasDisponibles = temas;
  _simState.temaActualIdx = 0;
  simRenderTemaPanel();
  simHighlightActiveCourse();
}

function simRenderTemaPanel(){
  const panel = document.getElementById('simTemaPanel');
  const nombre = document.getElementById('simTemaNombre');
  if(!panel || !nombre) return;
  if(!_simState.temasDisponibles.length){ panel.style.display = 'none'; return; }
  panel.style.display = 'block';
  const t = _simState.temasDisponibles[_simState.temaActualIdx];
  nombre.textContent = t ? t.name : '—';
}

function simTemaMove(delta){
  if(!_simState.temasDisponibles.length) return;
  const n = _simState.temasDisponibles.length;
  _simState.temaActualIdx = (_simState.temaActualIdx + delta + n) % n;
  simRenderTemaPanel();
}

function simRenderResultKeys(){
  const container = document.getElementById('simResultKeys');
  if(!container) return;
  const opts = [
    { key: '1', icon: '✓', label: 'Acerté', color: 'var(--accent3)' },
    { key: '2', icon: '⚠', label: 'Dudé',   color: 'var(--accent4)' },
    { key: '3', icon: '⏭', label: 'Salté',  color: '#f0a500' },
    { key: '4', icon: '✕', label: 'Fallé',  color: 'var(--accent2)' }
  ];
  container.innerHTML = opts.map(o =>
    '<button onclick="simMark(\'' + o.key + '\')" ' +
    'style="background:var(--card);border:1px solid ' + o.color + ';color:' + o.color + ';padding:.7rem .5rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.72rem;font-weight:600;line-height:1.4">' +
    o.icon + '<br><span style="font-size:.66rem;opacity:.8">' + o.key + ' · ' + o.label + '</span></button>'
  ).join('');
}

function simRenderStats(){
  const el = document.getElementById('simStats');
  if(!el) return;
  const p = _simState.preguntas;
  const total = p.length;
  if(!total){ el.textContent = 'Sin marcas aún — elegí curso y tema'; return; }
  const c = { a: 0, d: 0, s: 0, f: 0 };
  const byCourse = {};
  p.forEach(x => {
    if(x.result === 'acerto') c.a++;
    else if(x.result === 'dude') c.d++;
    else if(x.result === 'salte') c.s++;
    else if(x.result === 'falle') c.f++;
    byCourse[x.course] = (byCourse[x.course] || 0) + 1;
  });
  const parts = Object.entries(byCourse).map(([k, v]) => k + ': ' + v).join(' · ');
  el.innerHTML = '<strong>' + total + '</strong> marcas · ✓' + c.a + ' ⚠' + c.d + ' ⏭' + c.s + ' ✕' + c.f +
    '<br><span style="opacity:.7">' + parts + '</span>';
}

function simMark(key){
  if(_simState.pendiente) return;
  if(!_simState.cursoActual){
    showToast('Elegí un curso primero');
    return;
  }
  const tema = _simState.temasDisponibles[_simState.temaActualIdx];
  if(!tema){
    showToast('Elegí un tema primero');
    return;
  }

  const pregunta = {
    course: _simState.cursoActual,
    topicId: tema.id,
    topicName: tema.name,
    ts: Date.now()
  };

  if(key === '1'){ pregunta.result = 'acerto'; simPushPregunta(pregunta); }
  else if(key === '2'){ pregunta.result = 'dude'; simPushPregunta(pregunta); }
  else if(key === '3'){ pregunta.result = 'salte'; simPushPregunta(pregunta); simOpenSkipPause(pregunta); }
  else if(key === '4'){ pregunta.result = 'falle'; simPushPregunta(pregunta); simOpenErrorPause(pregunta); }
}

function simPushPregunta(pregunta){
  _simState.preguntas.push(pregunta);
  simRenderStats();
  simRenderPreguntaNum();
}

function simOpenSkipPause(pregunta){
  _simState.pendiente = { kind: 'skip', pregunta };
  _simState.errorPendiente = null;
  document.getElementById('simErrIcon').textContent = '⏸';
  document.getElementById('simErrTitle').textContent = 'PAUSADO';
  document.getElementById('simErrTitle').style.color = '#f0a500';
  document.getElementById('simErrSubtitle').innerHTML = '¿Por qué lo saltaste?<br><span style="color:var(--text)">' + pregunta.course + ' · ' + pregunta.topicName + '</span>';
  const opts = document.getElementById('simErrOptions');
  opts.innerHTML = SIM_SKIP_REASONS.map(r =>
    '<button data-key="' + r.key + '" onclick="simErrPick(\'' + r.key + '\')" ' +
    'style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.6rem .8rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.72rem;text-align:left;display:flex;align-items:center;gap:.5rem">' +
    '<span style="font-family:\'Syne\',sans-serif;font-weight:700;color:var(--accent);min-width:1rem">' + r.key + '</span>' +
    '<span>' + r.icon + '</span>' +
    '<span>' + r.label + '</span></button>'
  ).join('');
  document.getElementById('simErrorScreen').style.display = 'flex';
}

function simOpenErrorPause(pregunta){
  _simState.pendiente = { kind: 'error', pregunta };
  _simState.errorPendiente = null;
  document.getElementById('simErrIcon').textContent = '⏸';
  document.getElementById('simErrTitle').textContent = 'PAUSADO';
  document.getElementById('simErrTitle').style.color = 'var(--accent2)';
  document.getElementById('simErrSubtitle').innerHTML = '¿Qué falló?<br><span style="color:var(--text)">' + pregunta.course + ' · ' + pregunta.topicName + '</span>';
  const opts = document.getElementById('simErrOptions');
  opts.innerHTML = SIM_ERROR_TYPES.map(r =>
    '<button data-key="' + r.key + '" onclick="simErrPick(\'' + r.key + '\')" ' +
    'style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.6rem .8rem;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.72rem;text-align:left;display:flex;align-items:center;gap:.5rem">' +
    '<span style="font-family:\'Syne\',sans-serif;font-weight:700;color:var(--accent);min-width:1rem">' + r.key + '</span>' +
    '<span>' + r.icon + '</span>' +
    '<span>' + r.label + '</span></button>'
  ).join('');
  document.getElementById('simErrorScreen').style.display = 'flex';
}

function simErrPick(key){
  if(!_simState.pendiente) return;
  const kind = _simState.pendiente.kind;
  const list = kind === 'skip' ? SIM_SKIP_REASONS : SIM_ERROR_TYPES;
  const opt = list.find(x => x.key === key);
  if(!opt) return;
  _simState.errorPendiente = opt;
  document.querySelectorAll('#simErrOptions button').forEach(b => {
    b.style.borderColor = (b.dataset.key === key) ? 'var(--accent3)' : 'var(--border)';
    b.style.background = (b.dataset.key === key) ? 'rgba(52,211,153,.1)' : 'var(--bg)';
  });
}

function simErrConfirm(){
  if(!_simState.pendiente) return;
  const { kind, pregunta } = _simState.pendiente;
  const opt = _simState.errorPendiente;
  if(kind === 'skip'){
    pregunta.skipReason = opt ? opt.tag : 'sin_razon';
    pregunta.skipLabel = opt ? opt.label : '—';
  } else {
    pregunta.errorType = opt ? opt.tag : 'sin_tipo';
    pregunta.errorLabel = opt ? opt.label : '—';
  }
  _simState.pendiente = null;
  _simState.errorPendiente = null;
  document.getElementById('simErrorScreen').style.display = 'none';
  simRenderStats();
  simRenderPreguntaNum();
}

function simErrSkip(){
  if(!_simState.pendiente) return;
  const { kind, pregunta } = _simState.pendiente;
  if(kind === 'skip') pregunta.skipReason = 'sin_razon';
  else pregunta.errorType = 'sin_tipo';
  _simState.pendiente = null;
  _simState.errorPendiente = null;
  document.getElementById('simErrorScreen').style.display = 'none';
  simRenderStats();
  simRenderPreguntaNum();
}

/* Teclado global del simulacro */
document.addEventListener('keydown', (e) => {
  const ov = document.getElementById('simOverlay');
  if(!ov || ov.style.display === 'none') return;

  const errVisible = document.getElementById('simErrorScreen').style.display === 'flex';

  if(errVisible){
    if(e.key === 'Escape'){ simErrSkip(); e.preventDefault(); return; }
    if(e.key === 'Enter'){ simErrConfirm(); e.preventDefault(); return; }
    if(/^[1-5]$/.test(e.key)){ simErrPick(e.key); e.preventDefault(); return; }
    return;
  }

  const cfgVisible = document.getElementById('simConfigScreen').style.display !== 'none';
  if(cfgVisible) return;

  const resultVisible = document.getElementById('simResultScreen').style.display === 'flex';
  if(resultVisible){
    if(e.key === 'Escape'){ simExitAfterSave(); e.preventDefault(); }
    return;
  }

  if(e.key === 'Escape'){ simExit(); e.preventDefault(); return; }
  if(e.key === 'ArrowLeft'){ simTemaMove(-1); e.preventDefault(); return; }
  if(e.key === 'ArrowRight'){ simTemaMove(1); e.preventDefault(); return; }

  const keys = SIM_COURSE_KEYS[_simState?.tipo] || [];
  const found = keys.find(k => k.key === e.key);
  if(found){ simPickCourse(found.course); e.preventDefault(); return; }

  if(/^[1-4]$/.test(e.key)){ simMark(e.key); e.preventDefault(); }

  // Guardar con Ctrl+Enter (o Cmd+Enter en Mac)
  if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
    simFinish();
    e.preventDefault();
  }
});

/* ═══ FASE 2 — GUARDADO DEL SIMULACRO ═══ */

function simFinish(){
  if(!_simState) return;
  if(!_simState.preguntas.length){
    showToast('No marcaste ninguna pregunta');
    return;
  }

  // Detener el timer
  if(_simState.timerInt) clearInterval(_simState.timerInt);

  // Duración total
  const durationSecs = Math.floor((Date.now() - _simState.startTs) / 1000);

  // Agrupar por tema
  const byTopic = {};
  _simState.preguntas.forEach(p => {
    if(!byTopic[p.topicId]){
      byTopic[p.topicId] = {
        course: p.course,
        topicName: p.topicName,
        acerto: 0, dude: 0, salte: 0, falle: 0,
        total: 0,
        skipReasons: {},
        errorTypes: {}
      };
    }
    const t = byTopic[p.topicId];
    t.total++;
    if(p.result === 'acerto') t.acerto++;
    else if(p.result === 'dude') t.dude++;
    else if(p.result === 'salte'){
      t.salte++;
      const r = p.skipReason || 'sin_razon';
      t.skipReasons[r] = (t.skipReasons[r] || 0) + 1;
    }
    else if(p.result === 'falle'){
      t.falle++;
      const er = p.errorType || 'sin_tipo';
      t.errorTypes[er] = (t.errorTypes[er] || 0) + 1;
    }
  });

  const totalPreguntas = _simState.preguntas.length;
  const totalAcertos = _simState.preguntas.filter(p => p.result === 'acerto').length;
  const totalDudes = _simState.preguntas.filter(p => p.result === 'dude').length;
  const totalSaltes = _simState.preguntas.filter(p => p.result === 'salte').length;
  const totalFallos = _simState.preguntas.filter(p => p.result === 'falle').length;

  // Score real: acerto = 1, dude = 0.5, salte = 0, falle = 0
  const score = totalAcertos + totalDudes * 0.5;
  const scorePct = Math.round((score / totalPreguntas) * 100);

  const batchId = 'sim_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const date = today();

  // Objeto simulacro
  const sim = {
    id: batchId,
    date,
    tipo: _simState.tipo,
    durationSecs,
    totalQuestions: totalPreguntas,
    score,
    scorePct,
    totalAcertos, totalDudes, totalSaltes, totalFallos,
    byTopic
  };

  if(!S.simulacros) S.simulacros = [];
  S.simulacros.unshift(sim);
  if(S.simulacros.length > 100) S.simulacros = S.simulacros.slice(0, 100);

  // Distribución del tiempo por tema (proporcional a cantidad de preguntas)
  if(!S.speedSessions) S.speedSessions = [];
  const ts = Date.now();
  Object.entries(byTopic).forEach(([topicId, t]) => {
    const topicSecs = Math.round(durationSecs * t.total / totalPreguntas);
    S.speedSessions.push({
      topicId,
      course: t.course,
      topic: t.topicName,
      secs: topicSecs,
      easy: t.acerto,
      hard: t.dude,
      skipped: t.salte,
      failed: t.falle,
      date,
      ts,
      batchId,
      source: 'sim'
    });

    // Actualizar dominio del tema
    const rawAcc = (t.acerto * 100 + t.dude * 70 + t.salte * 40 + t.falle * 10) / t.total;
    const target = getSpeedTarget(t.course);
    const tpp = topicSecs / t.total;
    const speedRatio = target ? tpp / target : 1;
    let speedPenalty = 1;
    if(speedRatio > 1.5)      speedPenalty = 0.7;
    else if(speedRatio > 1.2) speedPenalty = 0.85;
    else if(speedRatio < 0.8) speedPenalty = 1.1;
    const effectiveAcc = Math.round(Math.min(100, rawAcc * speedPenalty));
    StudyPrioritizer.updateDominio(topicId, effectiveAcc);

    // Contar ejercicios resueltos
    if(!S.exCount) S.exCount = {};
    const goal = getExGoal(topicId);
    S.exCount[topicId] = Math.min(goal, (S.exCount[topicId] || 0) + (t.acerto + t.dude));
    renderExBadge(topicId);

    // Guardar velocidad acumulada en el topic
    if(!S.t) S.t = {};
    S.t[topicId] = S.t[topicId] || {};
    S.t[topicId].speedSecs = (S.t[topicId].speedSecs || 0) + topicSecs;
    S.t[topicId].speedProbs = (S.t[topicId].speedProbs || 0) + t.total;
    S.t[topicId].speedLast = date;
    renderTopicSpeed(topicId);

    // Repaso espaciado: si el tema tuvo mal rendimiento, programar repaso
    const acc = (t.acerto + t.dude * 0.5) / t.total;
    if(acc < 0.6){
      S.t[topicId].reviewDates = S.t[topicId].reviewDates || [];
      S.t[topicId].reviewsDone = S.t[topicId].reviewsDone || [];
      const reviewDate = localKey(new Date(Date.now() + 3 * 86400000));
      if(!S.t[topicId].reviewDates.includes(reviewDate)){
        S.t[topicId].reviewDates.push(reviewDate);
      }
    }
  });

  // Contar en sessions como un simulacro
  if(!S.sessions) S.sessions = [];
  S.sessions.unshift({
    date,
    course: 'Simulacro',
    topic: '[Sim ' + _simState.tipo + '] ' + totalPreguntas + ' preguntas',
    type: 'simulacro',
    energy: 'media',
    secs: durationSecs,
    ts
  });
  if(S.sessions.length > 200) S.sessions = S.sessions.slice(0, 200);

  save();

  // Mostrar resumen
  simShowResult(sim, byTopic, durationSecs);
}

function simShowResult(sim, byTopic, durationSecs){
  document.getElementById('simCaptureScreen').style.display = 'none';
  const result = document.getElementById('simResultScreen');
  result.style.display = 'flex';

  // Ordenar temas por peor accuracy primero
  const sortedTopics = Object.entries(byTopic).map(([id, t]) => {
    const acc = (t.acerto + t.dude * 0.5) / t.total;
    return { id, ...t, acc };
  }).sort((a, b) => a.acc - b.acc);

  const SKIP_LABELS = {
    no_se: 'No sé cómo',
    tiempo: 'Sin tiempo',
    bloqueo: 'Me bloqueé',
    lectura: 'No entendí',
    estrategia: 'Estrategia',
    sin_razon: 'Sin razón'
  };
  const ERR_LABELS = {
    conceptual: '🧠 Conceptual',
    procedimental: '📐 Procedimental',
    calculo: '🔢 Cálculo',
    lectura: '📖 Lectura',
    atencion: '⚠ Atención',
    sin_tipo: 'Sin clasificar'
  };

  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;

  let html = '<div style="max-width:720px;width:100%;margin:0 auto">';

  // Header
  html += '<div style="text-align:center;margin-bottom:1.5rem">'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:1.4rem;font-weight:700;color:var(--accent3);margin-bottom:.3rem">✓ Simulacro guardado</div>'
    + '<div style="font-size:.72rem;color:var(--muted)">' + mins + 'm ' + secs + 's · ' + sim.totalQuestions + ' preguntas · ' + sortedTopics.length + ' temas</div>'
    + '</div>';

  // Score global
  const scoreColor = sim.scorePct >= 70 ? 'var(--accent3)' : sim.scorePct >= 50 ? 'var(--accent4)' : 'var(--accent2)';
  html += '<div style="text-align:center;margin-bottom:1.5rem;padding:1rem;background:var(--card);border:1px solid var(--border);border-radius:8px">'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:2.5rem;font-weight:700;color:' + scoreColor + '">' + sim.scorePct + '%</div>'
    + '<div style="font-size:.72rem;color:var(--muted);margin-top:.3rem">'
    + '<span style="color:var(--accent3)">✓' + sim.totalAcertos + '</span> · '
    + '<span style="color:var(--accent4)">⚠' + sim.totalDudes + '</span> · '
    + '<span style="color:#f0a500">⏭' + sim.totalSaltes + '</span> · '
    + '<span style="color:var(--accent2)">✕' + sim.totalFallos + '</span>'
    + '</div></div>';

  // Tabla por tema
  html += '<div style="font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem">Por tema</div>';
  sortedTopics.forEach(t => {
    const accPct = Math.round(t.acc * 100);
    const accColor = accPct >= 70 ? 'var(--accent3)' : accPct >= 50 ? 'var(--accent4)' : 'var(--accent2)';
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:.7rem .9rem;margin-bottom:.5rem">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem">'
      + '<div style="font-size:.76rem;font-weight:600;color:var(--text)">' + t.topicName + '</div>'
      + '<div style="font-family:\'Syne\',sans-serif;font-size:.85rem;font-weight:700;color:' + accColor + '">' + accPct + '%</div>'
      + '</div>'
      + '<div style="font-size:.66rem;color:var(--muted)">'
      + '<span style="color:var(--accent3)">✓' + t.acerto + '</span> · '
      + '<span style="color:var(--accent4)">⚠' + t.dude + '</span> · '
      + '<span style="color:#f0a500">⏭' + t.salte + '</span> · '
      + '<span style="color:var(--accent2)">✕' + t.falle + '</span>'
      + '<span style="margin-left:.5rem;opacity:.6">· ' + t.course + '</span>'
      + '</div>';

    // Detalle de saltos y errores
    const details = [];
    Object.entries(t.skipReasons).forEach(([k, v]) => {
      details.push('⏭ ' + (SKIP_LABELS[k] || k) + ' ×' + v);
    });
    Object.entries(t.errorTypes).forEach(([k, v]) => {
      details.push('✕ ' + (ERR_LABELS[k] || k) + ' ×' + v);
    });
    if(details.length){
      html += '<div style="font-size:.64rem;color:var(--muted);margin-top:.35rem;padding-top:.35rem;border-top:1px solid var(--border);line-height:1.5">'
        + details.join(' · ')
        + '</div>';
    }

    html += '</div>';
  });

  // Botones finales
  html += '<div style="display:flex;gap:.5rem;margin-top:1.5rem">'
    + '<button onclick="simExitAfterSave()" style="flex:1;padding:.7rem;background:var(--accent);color:#000;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-size:.82rem;font-weight:700">Volver a Stats</button>'
    + '</div>';

  html += '</div>';

  result.innerHTML = html;
}

function simExitAfterSave(){
  _simState = null;
  document.getElementById('simOverlay').style.display = 'none';
  document.getElementById('simConfigScreen').style.display = 'flex';
  document.getElementById('simCaptureScreen').style.display = 'none';
  document.getElementById('simResultScreen').style.display = 'none';
  document.getElementById('simResultScreen').innerHTML = '';

  // Refrescar stats para que aparezcan los nuevos datos
  if(typeof renderStats === 'function' && document.getElementById('view-stats')?.classList.contains('active')){
    renderStats();
  }
  if(typeof renderHome === 'function' && document.getElementById('view-home')?.classList.contains('active')){
    renderHome();
  }
  if(typeof renderSpeedStats === 'function') renderSpeedStats();
  if(typeof refreshPlanIcons === 'function') refreshPlanIcons();

  showToast('✓ Datos actualizados');
}

/* ═══════════════════════════════════════════════════════════════
   FASE 3 — PANEL DE SIMULACROS GUARDADOS
   ═══════════════════════════════════════════════════════════════ */

function setSimTarget(val){
  const n = Math.max(0, Math.min(100, parseInt(val) || 60));
  S.simTargetPct = n;
  save();
  renderSimulacrosPanel();
}

function getSimTarget(){
  return typeof S.simTargetPct === 'number' ? S.simTargetPct : 60;
}

function renderSimulacrosPanel(){
  const sims = S.simulacros || [];
  const countEl = document.getElementById('simCount');
  if(countEl) countEl.textContent = sims.length ? '(' + sims.length + ')' : '(vacío)';

  const targetEl = document.getElementById('simTargetPct');
  if(targetEl) targetEl.value = getSimTarget();

  renderSimEvolChart(sims);
  renderSimulacrosList(sims);
}

function renderSimEvolChart(sims){
  const el = document.getElementById('simEvolChart');
  if(!el) return;

  if(!sims.length){
    el.innerHTML = '<div style="width:100%;text-align:center;font-size:.72rem;color:var(--muted);padding:.8rem 0">Sin simulacros guardados todavía.</div>';
    el.style.display = 'block';
    return;
  }

  el.style.display = 'flex';

  const target = getSimTarget();
  // Últimos 15, en orden cronológico (más viejo a la izquierda)
  const recent = [...sims].slice(0, 15).reverse();
  const maxScore = 100;

  const barsHtml = recent.map(s => {
    const pct = s.scorePct || 0;
    const height = Math.max(6, Math.round(pct / maxScore * 60));
    const above = pct >= target;
    const color = above ? 'var(--accent3)' : (pct >= target - 15 ? 'var(--accent4)' : 'var(--accent2)');
    const dateShort = (s.date || '').slice(5); // MM-DD
    const tipoShort = (s.tipo || '').slice(0, 4);

    return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer" title="' + s.date + ' · ' + (s.tipo || '') + ' · ' + pct + '%" onclick="scrollToSim(\'' + s.id + '\')">'
      + '<div style="font-size:.6rem;color:var(--muted);font-weight:600">' + pct + '</div>'
      + '<div style="width:100%;height:' + height + 'px;background:' + color + ';border-radius:3px 3px 0 0;min-width:14px;transition:height .3s"></div>'
      + '<div style="font-size:.56rem;color:var(--muted);white-space:nowrap">' + dateShort + '</div>'
      + '<div style="font-size:.56rem;color:var(--border);white-space:nowrap">' + tipoShort + '</div>'
      + '</div>';
  }).join('');

  // Línea del corte (visual: la mostramos como texto arriba)
  el.innerHTML = '<div style="width:100%;display:flex;flex-direction:column;gap:.3rem">'
    + '<div style="display:flex;justify-content:space-between;font-size:.64rem;color:var(--muted)">'
    + '<span>últimos ' + recent.length + ' simulacros</span>'
    + '<span>corte: <strong style="color:var(--accent3)">' + target + '%</strong></span>'
    + '</div>'
    + '<div style="display:flex;gap:4px;align-items:flex-end;height:80px">' + barsHtml + '</div>'
    + '</div>';
}

function renderSimulacrosList(sims){
  const el = document.getElementById('simulacrosList');
  if(!el) return;

  if(!sims.length){
    el.innerHTML = '<div style="font-size:.72rem;color:var(--muted);padding:.6rem 0;text-align:center">'
      + 'Cuando guardes un simulacro desde el cronómetro, aparece acá.'
      + '</div>';
    return;
  }

  const target = getSimTarget();

  el.innerHTML = sims.map(s => {
    const pct = s.scorePct || 0;
    const above = pct >= target;
    const pctColor = above ? 'var(--accent3)' : (pct >= target - 15 ? 'var(--accent4)' : 'var(--accent2)');
    const mins = Math.floor((s.durationSecs || 0) / 60);
    const secs = (s.durationSecs || 0) % 60;
    const tpp = s.totalQuestions ? Math.round((s.durationSecs || 0) / s.totalQuestions) : 0;

    // Desglose por tema (colapsado por defecto)
    const topicRows = Object.entries(s.byTopic || {}).map(([id, t]) => {
      const acc = t.total ? Math.round((t.acerto + t.dude * 0.5) / t.total * 100) : 0;
      const accColor = acc >= 70 ? 'var(--accent3)' : acc >= 50 ? 'var(--accent4)' : 'var(--accent2)';
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.3rem 0;border-bottom:1px solid var(--border);font-size:.66rem">'
        + '<span style="flex:1;color:var(--text)">' + t.topicName + '</span>'
        + '<span style="color:var(--muted);margin-right:.5rem">'
        + '<span style="color:var(--accent3)">✓' + t.acerto + '</span> '
        + '<span style="color:var(--accent4)">⚠' + t.dude + '</span> '
        + '<span style="color:#f0a500">⏭' + t.salte + '</span> '
        + '<span style="color:var(--accent2)">✕' + t.falle + '</span>'
        + '</span>'
        + '<span style="font-family:\'Syne\',sans-serif;font-weight:700;color:' + accColor + ';min-width:36px;text-align:right">' + acc + '%</span>'
        + '</div>';
    }).join('');

    return '<div class="sim-item" id="sim-item-' + s.id + '" style="background:var(--bg);border:1px solid var(--border);border-left:3px solid ' + pctColor + ';border-radius:6px;margin-bottom:.5rem;overflow:hidden">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem .8rem;cursor:pointer" onclick="toggleSimDetail(\'' + s.id + '\')">'
      + '<div style="flex:1">'
      + '<div style="font-size:.74rem;color:var(--text);font-weight:600">'
      + s.date + ' · <span style="color:var(--accent4)">' + (s.tipo || 'sim') + '</span>'
      + '</div>'
      + '<div style="font-size:.64rem;color:var(--muted);margin-top:.15rem">'
      + mins + 'm ' + secs + 's · ' + (s.totalQuestions || 0) + ' preguntas · ' + tpp + 's/preg · ' + Object.keys(s.byTopic || {}).length + ' temas'
      + '</div>'
      + '</div>'
      + '<div style="text-align:right;margin-right:.5rem">'
      + '<div style="font-family:\'Syne\',sans-serif;font-size:1.2rem;font-weight:700;color:' + pctColor + '">' + pct + '%</div>'
      + '<div style="font-size:.6rem;color:var(--muted)">'
      + '<span style="color:var(--accent3)">✓' + (s.totalAcertos || 0) + '</span> '
      + '<span style="color:var(--accent2)">✕' + (s.totalFallos || 0) + '</span>'
      + '</div>'
      + '</div>'
      + '<span style="color:var(--muted);font-size:.8rem">▼</span>'
      + '</div>'
      + '<div id="sim-detail-' + s.id + '" style="display:none;padding:.5rem .8rem .7rem;border-top:1px solid var(--border);background:var(--card)">'
      + topicRows
      + '<div style="display:flex;gap:.4rem;margin-top:.5rem;justify-content:flex-end">'
      + '<button onclick="delSimulacro(\'' + s.id + '\')" style="font-size:.64rem;padding:.25rem .55rem;background:transparent;border:1px solid var(--border);color:var(--muted);border-radius:4px;cursor:pointer;font-family:inherit">eliminar</button>'
      + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
}

function toggleSimDetail(simId){
  const el = document.getElementById('sim-detail-' + simId);
  if(!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function scrollToSim(simId){
  const el = document.getElementById('sim-item-' + simId);
  if(!el) return;
  el.scrollIntoView({behavior: 'smooth', block: 'center'});
  // Flash highlight
  el.style.transition = 'background .3s';
  el.style.background = '#1a1535';
  setTimeout(() => { el.style.background = 'var(--bg)'; }, 600);
  // Abrir el detalle
  const detail = document.getElementById('sim-detail-' + simId);
  if(detail && detail.style.display === 'none') detail.style.display = 'block';
}

function delSimulacro(simId){
  if(!S.simulacros) return;
  if(!confirm('¿Eliminar este simulacro? También se borrarán sus entradas de velocidad por tema asociadas.')) return;

  // Borrar del array
  const idx = S.simulacros.findIndex(s => s.id === simId);
  if(idx < 0) return;
  S.simulacros.splice(idx, 1);

  // Borrar speedSessions con ese batchId
  if(Array.isArray(S.speedSessions)){
    S.speedSessions = S.speedSessions.filter(s => s.batchId !== simId);
  }

  save();
  renderSimulacrosPanel();
  if(typeof renderSpeedStats === 'function') renderSpeedStats();
  showToast('✓ Simulacro eliminado');
}
