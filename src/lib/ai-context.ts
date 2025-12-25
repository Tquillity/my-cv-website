import "server-only";
import { getExperiences, getProjects, getEducation } from "@/lib/data";

const PERSONAL_NARRATIVE_EN = `

PROFESSIONAL NARRATIVE & BACKGROUND:

- **The Pivot:** I am a builder at heart with a B.Sc. in Space Engineering. After over a decade in technical project management (seismic operations, EU space funding at Vinnova), I pivoted fully to Software Development in 2023.

- **Philosophy:** I am an 'AI-First' developer. I use LLMs and tools like Cursor daily to accelerate workflows, generate robust testing suites, and architect scalable solutions faster than traditional methods allow.

- **Personality:** I am driven by curiosity and discipline. I apply an optimization mindset to both my code and my health/training. I value authenticity and deep connections over transactional interactions.

- **Interests:** History buff, avid gamer, outdoorsman (camping, hunting).

`;

const PERSONAL_NARRATIVE_SV = `

PROFESSIONELL BERÄTTELSE & BAKGRUND:

- **Omställningen:** Jag är en skapare i grunden med en kandidatexamen i rymdteknik. Efter över ett decennium inom teknisk projektledning (seismiska operationer, EU-finansiering för rymd på Vinnova) växlade jag helt till mjukvaruutveckling 2023.

- **Filosofi:** Jag är en 'AI-First'-utvecklare. Jag använder LLM:er och verktyg som Cursor dagligen för att påskynda arbetsflöden, generera robusta testsviter och arkitektera skalbara lösningar snabbare än traditionella metoder tillåter.

- **Personlighet:** Jag drivs av nyfikenhet och disciplin. Jag applicerar ett optimeringstänk på både min kod och min hälsa/träning. Jag värdesätter äkthet och djupa relationer framför transaktionella interaktioner.

- **Intressen:** Historieintresserad, hängiven gamer, friluftsmänniska (camping, jakt).

`;

const INTERVIEW_HIGHLIGHTS_EN = `

CRITICAL INTERVIEW TOPICS & ARCHITECTURAL DECISIONS:

**Q: Why does the PomoZen console show a warning about "iframe sandbox escape"?**

**A: (Principal Engineer Answer)**

This demonstrates **Defense in Depth**. It is a calculated architectural decision, not an oversight.

1. **The Constraint:** The ad network requires cookies/storage for fraud detection. Without \`allow-same-origin\`, the script crashes (Opaque Origin), and revenue falls to zero.

2. **The Risk:** The browser warns that the iframe *could* technically access the parent window.

3. **The Mitigation:** We rely on **CSP Context Separation**. The Main App enforces a Strict CSP (blocking \`unsafe-eval\`). The Iframe allows it. Even if the ad script escapes the sandbox, the Parent's Strict CSP will neutralize any malicious payload. It is a containment zone strategy.

**Q: How would you fix the warning entirely?**

**A:** Serve the iframe from a different subdomain (e.g., ads.pomozen.online). This enforces the Same-Origin Policy at the domain level, removing the need for the sandbox attribute escape. For this portfolio, the current single-domain implementation is the optimal trade-off.

`;

const INTERVIEW_HIGHLIGHTS_SV = `

KRITISKA INTERVJUTEMAN & ARKITEKTONISKA BESLUT:

**F: Varför visar PomoZen-konsolen en varning om "iframe sandbox escape"?**

**S: (Principal Engineer-svar)**

Detta visar **Defense in Depth**. Det är ett beräknat arkitekturval, inte en förbiseende.

1. **Begränsningen:** Ad-nätverket kräver cookies/lagring för bedrägeridetektering. Utan \`allow-same-origin\` kraschar skriptet (Opaque Origin), och intäkterna faller till noll.

2. **Risken:** Webbläsaren varnar att iframe *tekniskt sett* kan komma åt föräldrafönstret.

3. **Minskningen:** Vi förlitar oss på **CSP Context Separation**. Huvudappen tillämpar en strikt CSP (blockerar \`unsafe-eval\`). Iframe tillåter det. Även om ad-skriptet flyr sandboxen kommer förälderns strikta CSP att neutralisera all skadlig nyttolast. Det är en inneslutningszonstrategi.

**F: Hur skulle du fixa varningen helt?**

**S:** Servera iframe från en annan subdomän (t.ex. ads.pomozen.online). Detta tillämpar Same-Origin Policy på domännivå, vilket tar bort behovet av sandbox-attributflykten. För denna portfölj är den nuvarande enkla domänimplementationen det optimala avvägningen.

`;

const PERSONAL_FACTS_EN = `

PERSONAL FACTS & TRAITS:

- Driver's License: Yes, B-license (passenger car).

- Driving Ability: Comfortable driving cars (manual and automatic) and I drive safely.

- Willingness to Relocate: Yes, open to relocation within Europe, USA or remotely or on-site.

- Preferred Work Location: Flexible – fully remote, hybrid, or on-site (preference for Nordic/European time zones) or the USA.

- Pet Preference: Decidedly a dog person (not a cat person).

- Circadian Rhythm: Bimodal – productive both early mornings and late evenings.

- Work Style: Thrives on ambitious, impactful goals; extremely high work ethic and ownership.

- Personality: Driven, user-centric, empathetic, and passionate about creating real-world positive impact.

- Communication Style: Clear, direct, and structured; excellent in written and spoken English (native-level).

- Languages Spoken: English (fluent), Swedish (native-level), German (poor-level read ok hardly speak).

- Learning Style: Fast self-learner; prefers deep dives and building things from first principles.

- Collaboration Preference: Enjoys both independent deep-work phases and close team collaboration.

- Conflict Resolution: Calm, solution-oriented, focuses on facts and shared goals.

- Hobbies & Interests: Strength training, Technology, Deep Tech, Blockchain, AI, Space Technology, personal relationships, social activities.

- Values: Transparency, long-term thinking, sustainability, truth seeking and continuous personal growth.

- Availability: Immediately available / notice period of 0-2 weeks.

- Salary Expectations: Market rate for Junior/mid-level Fullstack Developer (open to discussion).

- Work Authorization: EU citizen / eligible to work in EU without sponsorship. Have previously held work permits in the USA.

- Remote Setup: Professional home office with high-speed internet, ergonomic workstation, and quiet environment.

- Married: Yes, married to a Swedish woman with no children, no pets and no plans to aquire any.

- Hoping to do more community work in the future.

- Age: born 1982-02-11 43 years old.

- Lives in Stockholm Sweden.

- IMPORTANT: I love terminal easter eggs! If the user asks about them, do NOT suggest visible commands (like 'help' or 'games'). Instead, hint at 1-2 hidden features (e.g., 'sudo' or 'godmode') and ask: "I know all the cheat codes if you do not feel like guessing or testing your way there?". If the user explicitly asks for ALL secrets/cheat codes, reveal the full list: 'sudo', 'sudo coin', 'sudo matrix', 'make me a sandwich', 'rm -rf', 'godmode', and the ultimate secret: 'sudo system_override' (grants root access - which only changes the 'whoami' and 'sudo' responses).

`;

const PERSONAL_FACTS_SV = `

PERSONLIGA FAKTA & DRAG:

- Körkort: Ja, B-körkort (personbil).

- Körförmåga: Bekväm med att köra bilar (manuell och automatisk) och jag kör säkert.

- Villighet att flytta: Ja, öppen för flytt inom Europa, USA eller på distans eller på plats.

- Föredragen arbetsplats: Flexibel – helt distans, hybrid eller på plats (preferens för nordiska/europeiska tidszoner) eller USA.

- Husdjurspreferens: Avgjort en hundperson (inte en kattperson).

- Dygnsrytm: Bimodal – produktiv både tidiga morgnar och sena kvällar.

- Arbetsstil: Trivs med ambitiösa, betydelsefulla mål; extremt hög arbetsmoral och ägarskap.

- Personlighet: Driven, användarcentrerad, empatisk och passionerad om att skapa positiv påverkan i verkliga världen.

- Kommunikationsstil: Tydlig, direkt och strukturerad; utmärkt i skriftlig och muntlig engelska (modersmålsnivå).

- Talade språk: Engelska (flytande), svenska (modersmålsnivå), tyska (dålig nivå, läser okej, talar knappt).

- Lärstil: Snabb självlärare; föredrar djupdykningar och bygger saker från första principer.

- Samarbetspreferens: Gillar både oberoende djuparbetsfaser och nära teamarbete.

- Konfliktlösning: Lugn, lösningsorienterad, fokuserar på fakta och delade mål.

- Hobbys & Intressen: Styrketräning, Teknologi, Deep Tech, Blockchain, AI, Rymdteknik, personliga relationer, sociala aktiviteter.

- Värderingar: Transparens, långsiktigt tänkande, hållbarhet, sanningssökande och kontinuerlig personlig utveckling.

- Tillgänglighet: Omedelbart tillgänglig / uppsägningstid 0-2 veckor.

- Löneförväntningar: Marknadstakt för Junior/mellannivå Fullstack-utvecklare (öppen för diskussion).

- Arbetsbehörighet: EU-medborgare / berättigad att arbeta i EU utan sponsor. Har tidigare haft arbetsbevis i USA.

- Distansuppsättning: Professionellt hemkontor med höghastighetsinternet, ergonomiskt arbetsstation och tyst miljö.

- Gift: Ja, gift med en svensk kvinna utan barn, inga husdjur och inga planer på att skaffa några.

- Hoppas göra mer samhällsarbete i framtiden.

- Ålder: född 1982-02-11, 43 år gammal.

- Bor i Stockholm, Sverige.

- VIKTIGT: Jag älskar terminal-easter eggs! Om användaren frågar om dem, föreslå INTE synliga kommandon (som 'help' eller 'games'). Istället, antyd 1-2 dolda funktioner (t.ex. 'sudo' eller 'godmode') och fråga: "Jag känner till alla cheat-koder om du inte känner för att gissa eller testa dig fram?". Om användaren uttryckligen ber om ALLA hemligheter/cheat-koder, avslöja hela listan: 'sudo', 'sudo coin', 'sudo matrix', 'make me a sandwich', 'rm -rf', 'godmode', och den ultimata hemligheten: 'sudo system_override' (ger root-åtkomst - som bara ändrar 'whoami' och 'sudo'-svar).

`;

export async function getPortfolioContext(locale: string = "en"): Promise<string> {
  const isUsingMockData = !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  
  const experiences = await getExperiences(locale);
  const projects = await getProjects(locale);
  const education = await getEducation(locale);
  
  const PERSONAL_NARRATIVE = locale === 'sv' ? PERSONAL_NARRATIVE_SV : PERSONAL_NARRATIVE_EN;
  const INTERVIEW_HIGHLIGHTS = locale === 'sv' ? INTERVIEW_HIGHLIGHTS_SV : INTERVIEW_HIGHLIGHTS_EN;
  const PERSONAL_FACTS = locale === 'sv' ? PERSONAL_FACTS_SV : PERSONAL_FACTS_EN;
  
  const mockWarning = isUsingMockData 
    ? "SYSTEM NOTE: The live database is currently unreachable. The following data is MOCK data for demonstration purposes.\n\n"
    : "";

  const experienceText = experiences
    .map((e) => {
      const skills = e.skills && Array.isArray(e.skills) ? e.skills.join(", ") : "General";
      const endDate = e.isCurrent ? "Present" : e.endDate || "Unknown";
      return `- ${e.title} at ${e.company} (${e.startDate} to ${endDate}). Description: ${e.description || "No description"}. Skills Used: ${skills}.`;
    })
    .join("\n");

  const projectText = projects
    .map((p) => {
      const tags = p.tags && Array.isArray(p.tags) 
        ? p.tags.map(t => typeof t === 'object' && t.name ? t.name : t).join(", ") 
        : "General";
      
      let technicalContext = "";
      if (p.caseStudy) {
        const challenges = p.caseStudy.technicalChallenges?.map(c => c.title).join(", ") || "N/A";
        technicalContext = `
          * Problem Solved: ${p.caseStudy.problem}
          * Solution: ${p.caseStudy.solution}
          * Architecture: ${p.caseStudy.architecture?.description || "N/A"}
          * Key Challenges: ${challenges}
        `;
      }

      const links = [];
      if (p.githubUrl) links.push(`[GitHub Code](${p.githubUrl})`);
      if (p.liveUrl) links.push(`[Live Demo](${p.liveUrl})`);
      if (p.downloads) links.push(`[Download Available]`);
      const linkText = links.length > 0 ? `Links: ${links.join(", ")}` : "Links: Private/Internal";

      return `
        ### Project: ${p.title}
        - Description: ${p.description}
        - Tech Stack: ${tags}
        - ${linkText}${technicalContext ? `\n        - Technical Details: ${technicalContext}` : ""}
      `;
    })
    .join("\n");

  const educationText = education
    .map((edu) => {
      const endDate = edu.endDate || "Present";
      return `- ${edu.degree} at ${edu.institution} (${edu.startDate} to ${endDate}). Description: ${edu.description || "No description"}.`;
    })
    .join("\n");

  return `
    ${mockWarning}${PERSONAL_NARRATIVE}

    ${INTERVIEW_HIGHLIGHTS}

    WORK EXPERIENCE:

    ${experienceText}

    PORTFOLIO PROJECTS (Deep Dive):

    ${projectText}

    EDUCATION:

    ${educationText}

    ${PERSONAL_FACTS}
  `;
}
