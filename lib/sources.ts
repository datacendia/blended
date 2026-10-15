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
  },
  {
    id: "sherrington2019",
    citation:
      "Sherrington C, Fairhall NJ, Wallbank GK, et al. Exercise for preventing falls in older people living in the community. Cochrane Database Syst Rev. 2019;1:CD012424.",
    usedFor: "Tai chi and balance exercise reduce falls in older adults living at home."
  },
  {
    id: "hall2011",
    citation:
      "Hall AM, Maher CG, Lam P, Ferreira M, Latimer J. Tai chi exercise for treatment of pain and disability in people with persistent low back pain: a randomized controlled trial. Arthritis Care Res. 2011;63(11):1576-1583.",
    usedFor: "Ten weeks of tai chi reduced pain and disability in persistent low back pain."
  },
  {
    id: "wieland2017",
    citation:
      "Wieland LS, Skoetz N, Pilkington K, Vempati R, D'Adamo CR, Berman BM. Yoga treatment for chronic non-specific low back pain. Cochrane Database Syst Rev. 2017;1:CD010671.",
    usedFor: "Yoga gives small-to-moderate improvements in back function, similar to other exercise."
  },
  {
    id: "vickers2018",
    citation:
      "Vickers AJ, Vertosick EA, Lewith G, et al. Acupuncture for chronic pain: update of an individual patient data meta-analysis. J Pain. 2018;19(5):455-474.",
    usedFor: "Acupuncture beats sham and no acupuncture for chronic pain, but the gap over sham is small."
  },
  {
    id: "standring2020",
    citation:
      "Standring S, ed. Gray's Anatomy: The Anatomical Basis of Clinical Practice. 42nd ed. Elsevier; 2020.",
    usedFor: "Autonomic wiring of the organs and the parts of a vertebra. Textbooks differ by a level or two on exact segment ranges."
  },
  {
    id: "nakashima2015",
    citation:
      "Nakashima H, Yukawa Y, Suda K, Yamagata M, Ueta T, Kato F. Abnormal findings on magnetic resonance images of the cervical spines in 1211 asymptomatic subjects. Spine. 2015;40(6):392-398.",
    usedFor: "Disc bulges appear on most neck MRIs of people with no symptoms, so a bulge on a scan doesn't prove it's the cause."
  },
  {
    id: "yoo1992",
    citation:
      "Yoo JU, Zou D, Edwards WT, Bayley J, Yuan HA. Effect of cervical spine motion on the neuroforaminal dimensions of human cervical spine. Spine. 1992;17(10):1131-1136.",
    usedFor: "The side opening a neck root leaves through gets smaller when looking up or turning toward that side, and larger when looking down."
  },
  {
    id: "kawchuk2015",
    citation:
      "Kawchuk GN, Fryer J, Jaremko JL, Zeng H, Rowe L, Thompson R. Real-time visualization of joint cavitation. PLoS One. 2015;10(4):e0119470.",
    usedFor: "The crack of a joint is a gas cavity forming in the joint fluid."
  },
  {
    id: "patel2012",
    citation:
      "Patel KC, Gross A, Graham N, et al. Massage for mechanical neck disorders. Cochrane Database Syst Rev. 2012;(9):CD004871.",
    usedFor: "Massage for neck pain: effects uncertain, no recommendation possible."
  },
  {
    id: "simons1999",
    citation:
      "Simons DG, Travell JG, Simons LS. Travell & Simons' Myofascial Pain and Dysfunction: The Trigger Point Manual. Vol 1: Upper Half of Body. 2nd ed. Baltimore: Williams & Wilkins; 1999.",
    usedFor: "Where pain from each neck and shoulder muscle is commonly felt (the referral maps)."
  },
  {
    id: "lucas2009",
    citation:
      "Lucas N, Macaskill P, Irwig L, Moran R, Bogduk N. Reliability of physical examination for diagnosis of myofascial trigger points: a systematic review of the literature. Clin J Pain. 2009;25(1):80-89.",
    usedFor: "Examiners often disagree on where trigger points are."
  },
  {
    id: "quintner2015",
    citation:
      "Quintner JL, Bove GM, Cohen ML. A critical evaluation of the trigger point phenomenon. Rheumatology (Oxford). 2015;54(3):392-399.",
    usedFor: "The trigger point theory behind the referral maps is disputed."
  },
  {
    id: "who2008",
    citation:
      "World Health Organization Regional Office for the Western Pacific. WHO Standard Acupuncture Point Locations in the Western Pacific Region. Manila: WHO; 2008.",
    usedFor: "Where named acupuncture points are located."
  },
  {
    id: "macpherson2015",
    citation:
      "MacPherson H, Tilbrook H, Richmond S, et al. Alexander Technique lessons or acupuncture sessions for persons with chronic neck pain: a randomized trial. Ann Intern Med. 2015;163(9):653-662.",
    usedFor: "In chronic neck pain, 12 acupuncture sessions or 20 Alexander lessons reduced pain at 12 months compared with usual care."
  },
  {
    id: "little2008",
    citation:
      "Little P, Lewith G, Webley F, et al. Randomised controlled trial of Alexander technique lessons, exercise, and massage (ATEAM) for chronic and recurrent back pain. BMJ. 2008;337:a884.",
    usedFor: "Alexander lessons helped chronic and recurrent back pain; six lessons plus exercise gave about 70% of the benefit of 24 lessons."
  },
  {
    id: "yamato2015",
    citation:
      "Yamato TP, Maher CG, Saragiotto BT, et al. Pilates for low back pain. Cochrane Database Syst Rev. 2015;(7):CD010265.",
    usedFor: "Pilates beats minimal care for chronic low back pain, but is not clearly better than other exercise."
  },
  {
    id: "gattie2017",
    citation:
      "Gattie E, Cleland JA, Snodgrass S. The effectiveness of trigger point dry needling for musculoskeletal conditions by physical therapists: a systematic review and meta-analysis. J Orthop Sports Phys Ther. 2017;47(3):133-149.",
    usedFor: "Dry needling by physios reduced musculoskeletal pain more than no treatment or sham, up to 12 weeks, at very low to moderate certainty."
  },
  {
    id: "white2004",
    citation:
      "White A. A cumulative review of the range and incidence of significant adverse events associated with acupuncture. Acupunct Med. 2004;22(3):122-133.",
    usedFor: "Serious harm from acupuncture is rare; a punctured lung is among the most reported serious events."
  },
  {
    id: "cao2012",
    citation: "Cao H, Li X, Liu J. An updated review of the efficacy of cupping therapy. PLoS One. 2012;7(2):e31793.",
    usedFor: "Many cupping trials report benefit for pain, but most are low quality."
  },
  {
    id: "ernst2009",
    citation: "Ernst E. Is reflexology an effective intervention? A systematic review of randomised controlled trials. Med J Aust. 2009;191(5):263-266.",
    usedFor: "No convincing evidence that reflexology treats any medical condition."
  },
  {
    id: "nhmrc2015",
    citation:
      "National Health and Medical Research Council. NHMRC Information Paper: Evidence on the effectiveness of homeopathy for treating health conditions. Canberra: NHMRC; 2015.",
    usedFor: "No health condition for which there is reliable evidence that homeopathy works."
  },
  {
    id: "padua2016",
    citation:
      "Padua L, Coraci D, Erra C, et al. Carpal tunnel syndrome: clinical features, diagnosis, and management. Lancet Neurol. 2016;15(12):1273-1284.",
    usedFor: "Carpal tunnel syndrome: where it is felt, night symptoms, and how it is confirmed."
  }
] as const satisfies readonly Source[];

export type SourceId = (typeof SOURCES)[number]["id"];

export function sourceById(id: SourceId): Source {
  const found = SOURCES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown source ${id}`);
  return found;
}
