/**
 * Every claim RootAtlas makes about evidence points at one of these. They are
 * cited by author, year and journal so a reader can find them; there are no
 * DOIs or URLs on purpose — a mistyped DOI looks authoritative and sends
 * people somewhere wrong, while a citation is checkable in any library search.
 *
 * Adding a claim means adding its source here first. A test fails when any
 * evidence entry cites an id that is not in this table.
 */
export interface Source {
  id: string;
  citation: string;
  /** What the source is used for, in one line. */
  usedFor: string;
}

export const SOURCES = [
  {
    id: "radhakrishnan1994",
    citation:
      "Radhakrishnan K, Litchy WJ, O'Fallon WM, Kurland LT. Epidemiology of cervical radiculopathy: a population-based study from Rochester, Minnesota, 1976 through 1990. Brain. 1994;117(2):325-335.",
    usedFor: "Which cervical roots are affected most often (C7, then C6); natural course."
  },
  {
    id: "wong2014",
    citation:
      "Wong JJ, Côté P, Quesnele JJ, Stern PJ, Mior SA. The course and prognostic factors of symptomatic cervical disc herniation with radiculopathy: a systematic review of the literature. Spine J. 2014;14(8):1781-1789.",
    usedFor: "Most cervical radiculopathy improves substantially within months."
  },
  {
    id: "wainner2003",
    citation:
      "Wainner RS, Fritz JM, Irrgang JJ, Boninger ML, Delitto A, Allison S. Reliability and diagnostic accuracy of the clinical examination and patient self-report measures for cervical radiculopathy. Spine. 2003;28(1):52-62.",
    usedFor: "The four-test examination cluster for cervical radiculopathy."
  },
  {
    id: "young2010",
    citation:
      "Young IA, Cleland JA, Michener LA, Brown C. Reliability, construct validity, and responsiveness of the Neck Disability Index, Patient-Specific Functional Scale, and Numeric Pain Rating Scale in patients with cervical radiculopathy. Am J Phys Med Rehabil. 2010;89(10):831-839.",
    usedFor: "Minimal clinically important differences for neck-arm pain (pain 2.2, function 2.0)."
  },
  {
    id: "farrar2001",
    citation:
      "Farrar JT, Young JP Jr, LaMoreaux L, Werth JL, Poole RM. Clinical importance of changes in chronic pain intensity measured on an 11-point numerical pain rating scale. Pain. 2001;94(2):149-158.",
    usedFor: "A ~2-point (~30%) drop on a 0-10 pain scale is the change patients notice."
  },
  {
    id: "stratford1995",
    citation:
      "Stratford P, Gill C, Westaway M, Binkley J. Assessing disability and change on individual patients: a report of a patient specific measure. Physiotherapy Canada. 1995;47(4):258-263.",
    usedFor: "The Patient-Specific Functional Scale used by the tracker."
  },
  {
    id: "blanpied2017",
    citation:
      "Blanpied PR, Gross AR, Elliott JM, et al. Neck Pain: Revision 2017. Clinical Practice Guidelines linked to the International Classification of Functioning, Disability and Health from the Orthopaedic Section of the American Physical Therapy Association. J Orthop Sports Phys Ther. 2017;47(7):A1-A83.",
    usedFor: "Guideline recommendations for neck pain with and without arm pain."
  },
  {
    id: "bono2011",
    citation:
      "Bono CM, Ghiselli G, Gilbert TJ, et al. An evidence-based clinical guideline for the diagnosis and treatment of cervical radiculopathy from degenerative disorders. Spine J. 2011;11(1):64-72.",
    usedFor: "North American Spine Society guideline: most non-surgical treatments for cervical radiculopathy have insufficient evidence either way."
  },
  {
    id: "gross2015manip",
    citation:
      "Gross A, Langevin P, Burnie SJ, et al. Manipulation and mobilisation for neck pain contrasted against an inactive control or another active treatment. Cochrane Database Syst Rev. 2015;(9):CD004249.",
    usedFor: "Manipulation and mobilisation for neck pain: small, mostly short-term effects, low-to-moderate certainty."
  },
  {
    id: "gross2015ex",
    citation:
      "Gross A, Kay TM, Paquin JP, et al. Exercises for mechanical neck disorders. Cochrane Database Syst Rev. 2015;1:CD004250.",
    usedFor: "Exercise for neck pain."
  },
  {
    id: "basson2017",
    citation:
      "Basson A, Olivier B, Ellis R, Coppieters M, Stewart A, Mudzi W. The effectiveness of neural mobilization for neuromusculoskeletal conditions: a systematic review and meta-analysis. J Orthop Sports Phys Ther. 2017;47(9):593-615.",
    usedFor: "Neural mobilisation (nerve gliding)."
  },
  {
    id: "kuijper2009",
    citation:
      "Kuijper B, Tans JTJ, Beelen A, Nollet F, de Visser M. Cervical collar or physiotherapy versus wait and see policy for recent onset cervical radiculopathy: randomised trial. BMJ. 2009;339:b3883.",
    usedFor: "Short-term collar or physiotherapy speeds early arm-pain relief versus waiting."
  },
  {
    id: "persson1997",
    citation:
      "Persson LC, Carlsson CA, Carlsson JY. Long-lasting cervical radicular pain managed with surgery, physiotherapy, or a cervical collar: a prospective, randomized study. Spine. 1997;22(7):751-758.",
    usedFor: "Surgery versus physiotherapy versus collar: similar pain at one year."
  },
  {
    id: "cote2021",
    citation:
      "Côté P, Hartvigsen J, Axén I, et al. The global summit on the efficacy and effectiveness of spinal manipulative therapy for the prevention and treatment of non-musculoskeletal disorders: a systematic review of the literature. Chiropr Man Therap. 2021;29(1):8.",
    usedFor: "No evidence that spinal manipulation treats organ or other non-musculoskeletal conditions."
  },
  {
    id: "biller2014",
    citation:
      "Biller J, Sacco RL, Albuquerque FC, et al. Cervical arterial dissections and association with cervical manipulative therapy: a statement for healthcare professionals from the American Heart Association/American Stroke Association. Stroke. 2014;45(10):3155-3174.",
    usedFor: "Neck manipulation and artery dissection: an association, causation not established; patients should be informed."
  },
  {
    id: "cassidy2008",
    citation:
      "Cassidy JD, Boyle E, Côté P, et al. Risk of vertebrobasilar stroke and chiropractic care: results of a population-based case-control and case-crossover study. Spine. 2008;33(4 Suppl):S176-S183.",
    usedFor: "Stroke risk was similarly associated with chiropractor and family-doctor visits — early dissection may cause the neck pain that prompts the visit."
  },
  {
    id: "hansraj2014",
    citation:
      "Hansraj KK. Assessment of stresses in the cervical spine caused by posture and position of the head. Surg Technol Int. 2014;25:277-279.",
    usedFor: "The widely quoted 'effective head weight' figures come from a computer model."
  },
  {
    id: "mahmoud2019",
    citation:
      "Mahmoud NF, Hassan KA, Abdelmajeed SF, Moustafa IM, Silva AG. The relationship between forward head posture and neck pain: a systematic review and meta-analysis. Curr Rev Musculoskelet Med. 2019;12(4):562-577.",
    usedFor: "Forward head posture is associated with neck pain in adults; association is not causation."
  },
  {
    id: "fda2014",
    citation:
      "US Food and Drug Administration. Drug Safety Communication: FDA requires label changes to warn of rare but serious neurologic problems after epidural corticosteroid injections for pain. April 2014.",
    usedFor: "Rare serious risks of epidural steroid injections."
  },
  {
    id: "aca-choosingwisely",
    citation:
      "American Chiropractic Association. Five things physicians and patients should question. Choosing Wisely (ABIM Foundation), 2017.",
    usedFor: "No spinal imaging for acute low back pain in the first six weeks without red flags."
  }
] as const satisfies readonly Source[];

export type SourceId = (typeof SOURCES)[number]["id"];

export function sourceById(id: SourceId): Source {
  const found = SOURCES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown source ${id}`);
  return found;
}
