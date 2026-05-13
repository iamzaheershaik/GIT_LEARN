const phases = [
  {id:'phase1',num:'01',title:'SQL Foundations',cls:'p1',weeks:'Weeks 1–2',tool:'SQLite',goal:'Understand what databases are, how tables work, and write your first real SQL queries.'},
  {id:'phase2',num:'02',title:'Intermediate SQL',cls:'p2',weeks:'Weeks 3–4',tool:'SQLite',goal:'Aggregate data, combine multiple tables, and write business-level queries.'},
  {id:'phase3',num:'03',title:'Advanced SQL',cls:'p3',weeks:'Weeks 5–6',tool:'PostgreSQL',goal:'Write expert-level SQL — CTEs, window functions, optimization, transactions, and database programming.'},
  {id:'phase4',num:'04',title:'PostgreSQL Deep Dive',cls:'p4',weeks:'Weeks 7–8',tool:'PostgreSQL',goal:'Master PostgreSQL-specific features used in production systems.'},
  {id:'phase5',num:'05',title:'Backend Integration',cls:'p5',weeks:'Weeks 9–10',tool:'Node.js + PostgreSQL',goal:'Connect your SQL knowledge to Node.js and MERN stack development.'},
  {id:'phase6',num:'06',title:'Industry & Interviews',cls:'p6',weeks:'Weeks 11–12',tool:'All Tools',goal:'Prepare for SQL interviews and build portfolio projects.'}
];

async function loadMarkdown(){
  try{
    const resp=await fetch('../SQL_Complete_Learning_Roadmap.md');
    const md=await resp.text();
    const phaseMarkers=[
      {start:'# PHASE 1',end:'# PHASE 2'},
      {start:'# PHASE 2',end:'# PHASE 3'},
      {start:'# PHASE 3',end:'# PHASE 4'},
      {start:'# PHASE 4',end:'# PHASE 5'},
      {start:'# PHASE 5',end:'# PHASE 6'},
      {start:'# PHASE 6',end:'## 📚 REFERENCE CARD'}
    ];
    const lines=md.split('\n');
    
    function findLine(text){
      for(let i=0;i<lines.length;i++){
        if(lines[i].includes(text))return i;
      }
      return -1;
    }

    phases.forEach((phase,idx)=>{
      const startIdx=findLine(phaseMarkers[idx].start);
      const endIdx=findLine(phaseMarkers[idx].end);
      let content='';
      if(startIdx>=0 && endIdx>=0){
        content=lines.slice(startIdx+3,endIdx).join('\n');
      }else if(startIdx>=0){
        content=lines.slice(startIdx+3).join('\n');
      }
      
      // Remove the phase header lines
      content=content.replace(/^# ═+$/gm,'').replace(/^# PHASE \d.*$/gm,'').replace(/^# ═+$/gm,'');
      
      const el=document.getElementById(phase.id);
      el.innerHTML=`
        <div class="phase-header-bar" onclick="togglePhase('${phase.id}')">
          <span class="phase-num ${phase.cls}">PHASE ${phase.num}</span>
          <span class="phase-title">${phase.title}</span>
          <span class="phase-meta">${phase.weeks} · ${phase.tool}</span>
          <span class="phase-toggle" id="toggle-${phase.id}">▼</span>
        </div>
        <div class="phase-content" id="content-${phase.id}">
          <div class="phase-goal"><strong>Goal:</strong> ${phase.goal}</div>
          <div class="md-content">${marked.parse(content)}</div>
        </div>
      `;
    });

    // Also render the reference card at the end
    const refIdx=findLine('## 📚 REFERENCE CARD');
    if(refIdx>=0){
      const refContent=lines.slice(refIdx).join('\n');
      const refDiv=document.createElement('div');
      refDiv.className='phase-section';
      refDiv.innerHTML=`
        <div class="phase-header-bar" onclick="togglePhase('ref')" style="border-left:3px solid var(--accent)">
          <span class="phase-num" style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);color:var(--accent)">REF</span>
          <span class="phase-title">Reference Card & Final Checklist</span>
          <span class="phase-toggle" id="toggle-ref">▼</span>
        </div>
        <div class="phase-content" id="content-ref">
          <div class="md-content">${marked.parse(refContent)}</div>
        </div>
      `;
      document.querySelector('main').appendChild(refDiv);
    }

    // Syntax highlight SQL in code blocks
    document.querySelectorAll('pre code').forEach(block=>{
      let html=block.innerHTML;
      // SQL keywords
      const keywords=['SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','DROP','ALTER','JOIN','INNER','LEFT','RIGHT','FULL','OUTER','ON','AND','OR','NOT','IN','BETWEEN','LIKE','IS','NULL','ORDER','BY','ASC','DESC','LIMIT','OFFSET','GROUP','HAVING','AS','DISTINCT','COUNT','SUM','AVG','MAX','MIN','UNION','ALL','EXISTS','CASE','WHEN','THEN','ELSE','END','PRIMARY','KEY','FOREIGN','REFERENCES','AUTOINCREMENT','SERIAL','BIGSERIAL','INTEGER','TEXT','REAL','NUMERIC','BOOLEAN','DATE','VARCHAR','TIMESTAMP','UUID','JSONB','WITH','RECURSIVE','OVER','PARTITION','ROW_NUMBER','RANK','DENSE_RANK','LAG','LEAD','FIRST_VALUE','LAST_VALUE','NTILE','BEGIN','COMMIT','ROLLBACK','SAVEPOINT','GRANT','REVOKE','INDEX','UNIQUE','CHECK','DEFAULT','NOT NULL','CASCADE','RETURNING','USING','GIN','EXPLAIN','ANALYZE','FUNCTION','PROCEDURE','TRIGGER','VIEW','REPLACE','IF','ELSIF','RETURN','RETURNS','LANGUAGE','RAISE','EXCEPTION','CALL','AFTER','BEFORE','FOR','EACH','ROW','EXECUTE','NEW','OLD','EXTRACT','DATE_TRUNC','NOW','INTERVAL','ANY','ARRAY','TSVECTOR','TIMESTAMPTZ','CONSTRAINT','ADD','COLUMN','RENAME','TO','TRUNCATE','CROSS'];
      keywords.forEach(kw=>{
        const re=new RegExp('\\b('+kw+')\\b','g');
        html=html.replace(re,'<span style="color:#569cd6">$1</span>');
      });
      // strings
      html=html.replace(/'([^']*)'/g,"<span style=\"color:#ce9178\">'$1'</span>");
      // comments
      html=html.replace(/(--.*)/g,'<span style="color:#6a9955">$1</span>');
      // numbers
      html=html.replace(/\b(\d+\.?\d*)\b/g,'<span style="color:#b5cea8">$1</span>');
      block.innerHTML=html;
    });

  }catch(e){
    console.error('Failed to load markdown:',e);
    document.querySelector('main').innerHTML+='<div style="padding:2rem;color:var(--accent2)">⚠️ Could not load the markdown file. Make sure SQL_Complete_Learning_Roadmap.md is in the same directory and you\'re serving via a local server (not file://).</div>';
  }
}

function togglePhase(id){
  const content=document.getElementById('content-'+id);
  const toggle=document.getElementById('toggle-'+id);
  if(content.classList.contains('open')){
    content.classList.remove('open');
    content.style.display='none';
    toggle.classList.remove('open');
  }else{
    content.classList.add('open');
    content.style.display='block';
    toggle.classList.add('open');
  }
}

// Progress bar
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
  document.getElementById('progressFill').style.width=pct+'%';
});

// Active nav highlight
const navLinks=document.querySelectorAll('nav a');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(l=>l.classList.remove('active'));
      const link=document.querySelector(`nav a[href="#${e.target.id}"]`);
      if(link)link.classList.add('active');
    }
  });
},{threshold:0.3});
document.querySelectorAll('.phase-section, #overview').forEach(s=>observer.observe(s));

// Load content
document.addEventListener('DOMContentLoaded',loadMarkdown);
