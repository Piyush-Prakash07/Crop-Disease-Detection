// Fertilizer, Chemical Prescriptions & Disease Medical Data Repository

export const FERTILIZER_RECOMMENDATIONS = {
  // 1. Tomato Early Blight
  'Tomato_Early_blight': {
    primaryFertilizer: 'Potassium fertilizer (0-0-60 KCL or Potassium Sulfate K2SO4)',
    fungicide: 'Copper-based fungicide (Copper Hydroxide) or Chlorothalonil',
    recommendedFormula: 'Copper-based fungicide + Potassium fertilizer boost',
    applicationMethod: 'Foliar spray copper fungicide every 7-10 days at sunrise or sunset. Apply potassium sulfate to soil base around drip line to fortify plant cell walls against fungal hyphae penetration.',
    nitrogenGuideline: 'Maintain balanced Nitrogen; avoid nitrogen deficiency which triggers premature senescence of lower leaves making them vulnerable.',
    dosageNote: '2.5g Copper Hydroxide per liter water foliar spray + 5g Potassium Sulfate per plant base monthly.',
    organicAlternative: 'Neem seed extract oil (5ml/L) + Trichoderma viride bio-fungicide soil drench.',
    actionPriority: 'High - Spray within 24-48 hours'
  },

  // 2. Tomato Late Blight
  'Tomato_Late_blight': {
    primaryFertilizer: 'Low-Nitrogen NPK (5-10-15) + Calcium Nitrate leaf fortifier',
    fungicide: 'Mancozeb 75% WP / Metalaxyl-M (Ridomil Gold)',
    recommendedFormula: 'Mancozeb / Cymoxanil fungicide + Calcium Nitrate soil feed',
    applicationMethod: 'Immediately spray systemic fungicide (Metalaxyl/Mancozeb) ensuring complete coverage of leaf undersides. Prune heavily infected lower leaves and burn them off-site.',
    nitrogenGuideline: 'STRICT WARNING: Cut off high-nitrogen fertilizers immediately. Excess nitrogen creates tender succulent growth that rots within 48 hours under late blight spores.',
    dosageNote: '2.5g Mancozeb per liter water. Apply Calcium Nitrate (2g/L) for cellular membrane reinforcement.',
    organicAlternative: 'Copper sulfate + hydrated lime (Bordeaux mixture 1%) foliar protective wash.',
    actionPriority: 'Urgent Emergency - Treat within 12 hours'
  },

  // 3. Potato Early Blight
  'Potato___Early_blight': {
    primaryFertilizer: 'Balanced NPK fertilizer (10-10-10 or 12-12-17 with Sulfur & Magnesium)',
    fungicide: 'Chlorothalonil 75% WP or Azoxystrobin',
    recommendedFormula: 'Chlorothalonil protective spray + Balanced NPK hill side-dressing',
    applicationMethod: 'Apply Chlorothalonil early in the season when concentric target spots first appear on lower foliage. Side-dress potato hills with balanced NPK during earthing up.',
    nitrogenGuideline: 'Provide steady balanced NPK nutrition; nitrogen-starved vines defoliate prematurely, causing high yield loss.',
    dosageNote: '2.0 ml Chlorothalonil per liter water. Apply 50g balanced NPK per potato hill during row closure.',
    organicAlternative: 'Bacillus subtilis bio-fungicide spray weekly + compost tea soil drench.',
    actionPriority: 'Moderate - Apply on regular spray cycle'
  },

  // 4. Tomato Healthy
  'Tomato_healthy': {
    primaryFertilizer: 'Standard Balanced NPK (19-19-19 or 10-10-10) + Micronutrients',
    fungicide: 'None required (Preventative pure cold-pressed Neem oil optional)',
    recommendedFormula: 'Standard seasonal NPK balanced fertilization regime',
    applicationMethod: 'Side-dress with balanced NPK fertilizer every 3-4 weeks. Supplement with compost tea or seaweed liquid fertilizer during flowering and fruit setting.',
    nitrogenGuideline: 'Optimal balanced NPK maintenance. Avoid excessive nitrogen to prevent vegetative overgrowth over fruiting.',
    dosageNote: '15g NPK per plant every 3 weeks + organic mulch layer around base.',
    organicAlternative: 'Vermicompost (200g/plant) + periodic fermented seaweed foliar spray.',
    actionPriority: 'Maintenance - Crop in excellent health'
  },

  // 5. Potato Healthy
  'Potato___healthy': {
    primaryFertilizer: 'Standard Potato NPK (8-24-24 or 10-20-20 High Phosphorus & Potassium)',
    fungicide: 'None required',
    recommendedFormula: 'Continue standard Potato tuber-bulking NPK regime',
    applicationMethod: 'Maintain consistent soil moisture and apply high-phosphorus and potassium fertilizer during tuber initiation and swelling stages.',
    nitrogenGuideline: 'Moderate Nitrogen to build a strong leafy canopy early without excessive vegetative delay.',
    dosageNote: '40g High-PK fertilizer per meter row during second earthing-up.',
    organicAlternative: 'Aged farmyard manure + wood ash (potassium source) incorporated into ridges.',
    actionPriority: 'Maintenance - Vigorous healthy tubers'
  },

  // 6. Pepper Bell Healthy
  'Pepper__bell___healthy': {
    primaryFertilizer: 'Balanced NPK (15-15-15) + Epsom Salt (Magnesium Sulfate)',
    fungicide: 'None required',
    recommendedFormula: 'Standard NPK feeding + Magnesium foliar spray',
    applicationMethod: 'Apply balanced NPK at root zone. Spray mild Epsom salt solution (1 tsp/gallon) monthly to maintain deep green chlorophyll synthesis and blossom retention.',
    nitrogenGuideline: 'Maintain balanced nitrogen. Excess N causes blossom drop.',
    dosageNote: '10g NPK per pepper plant every 3 weeks + 2g Epsom salt foliar spray.',
    organicAlternative: 'Compost mulch + bone meal (Phosphorus) & kelp meal.',
    actionPriority: 'Maintenance - Prime foliage & fruit set'
  },

  // 7. Pepper Bell Bacterial Spot
  'Pepper__bell___Bacterial_spot': {
    primaryFertilizer: 'Potassium & Calcium booster (0-0-50 Potassium Sulfate + Calcium Chelate)',
    fungicide: 'Fixed Copper Hydroxide + Streptomycin / Mancozeb tank mix',
    recommendedFormula: 'Copper-based bactericide spray + Calcium & Potassium plant cell booster',
    applicationMethod: 'Spray copper bactericide mixed with protective Mancozeb every 5-7 days. Apply Calcium and Potassium to soil to reinforce leaf membrane stiffness against bacterial enzyme lysis.',
    nitrogenGuideline: 'Reduce nitrogen feeding immediately during active bacterial outbreaks to avoid soft succulent tissue.',
    dosageNote: '2g Copper Hydroxide + 1.5g Mancozeb per liter of water. Avoid overhead sprinkler irrigation.',
    organicAlternative: 'Bacillus amyloliquefaciens microbial bactericide spray + liquid copper soap.',
    actionPriority: 'High - Prevent field-wide defoliation'
  },

  // 8. Potato Late Blight
  'Potato___Late_blight': {
    primaryFertilizer: 'Potassium Sulfate & Potassium Silicate additive',
    fungicide: 'Cymoxanil + Mancozeb (Curzate) / Metalaxyl (Ridomil Gold)',
    recommendedFormula: 'Systemic curative Oomycete fungicide + stop all Nitrogen',
    applicationMethod: 'Immediate canopy spray with systemic fungicide (Cymoxanil/Mancozeb). Destroy severely blighted hills to prevent tuber rot. Hill soil tightly over tubers to shield them from rain-washed spores.',
    nitrogenGuideline: 'Cease all nitrogen application immediately until the epidemic is fully arrested.',
    dosageNote: '2.5g Ridomil Gold or Curzate per liter of water immediately upon detection.',
    organicAlternative: 'Copper Hydroxide (Kocide 3000) at 2g/L applied prior to rainfall events.',
    actionPriority: 'Critical Emergency - Spreads at rapid rates'
  },

  // 9. Tomato Bacterial Spot
  'Tomato_Bacterial_spot': {
    primaryFertilizer: 'Calcium Nitrate + Potassium Sulfate (0-0-50)',
    fungicide: 'Fixed Copper Bactericide + Mancozeb (tank mix synergistic blend)',
    recommendedFormula: 'Copper bactericide + Mancozeb spray + Calcium Nitrate root boost',
    applicationMethod: 'Spray copper + mancozeb tank mix on both upper and lower leaf surfaces every 7 days. Water exclusively via drip irrigation to avoid splashing bacterial droplets.',
    nitrogenGuideline: 'Avoid high quick-release nitrogen that encourages soft, watery stem and leaf tissue.',
    dosageNote: '2g Copper bactericide + 1.5g Mancozeb per liter water foliar spray.',
    organicAlternative: 'Liquid copper octanoate (copper soap) + Bacillus subtilis spray.',
    actionPriority: 'High - Stop bacterial spread to developing fruit'
  },

  // 10. Tomato Leaf Mold
  'Tomato_Leaf_Mold': {
    primaryFertilizer: 'Potassium & Phosphorus blend (5-15-30) + Bio-stimulant',
    fungicide: 'Difenoconazole / Copper Soap Fungicide',
    recommendedFormula: 'Difenoconazole fungicide + High Potassium canopy fortification',
    applicationMethod: 'Improve greenhouse/canopy ventilation immediately; lower relative humidity below 85%. Prune suckers and lower dense foliage. Spray Difenoconazole thoroughly underneath leaves.',
    nitrogenGuideline: 'Balanced nitrogen with high potassium to promote thicker leaf cuticle.',
    dosageNote: '1 ml Difenoconazole or 3 ml Copper Soap per liter water.',
    organicAlternative: 'Potassium bicarbonate spray (3g/L with horticultural surfactant).',
    actionPriority: 'Moderate - High urgency in greenhouse environments'
  },

  // 11. Tomato Septoria Leaf Spot
  'Tomato_Septoria_leaf_spot': {
    primaryFertilizer: 'Balanced NPK (10-10-10) + Organic Humic Acid',
    fungicide: 'Chlorothalonil 75% WP or Ziram / Copper Oxychloride',
    recommendedFormula: 'Chlorothalonil protective fungicide + Potassium & Humic Acid boost',
    applicationMethod: 'Strip off infected lower leaves up to 12 inches above soil line. Mulch soil with straw or plastic to stop soil rain-splash. Spray Chlorothalonil every 7-10 days.',
    nitrogenGuideline: 'Provide moderate balanced nitrogen to encourage healthy new vegetative shoot replacement.',
    dosageNote: '2 ml Chlorothalonil or 2.5g Copper Oxychloride per liter water.',
    organicAlternative: 'Bio-fungicide (Trichoderma harzianum) foliar spray + organic straw mulch.',
    actionPriority: 'Moderate - High yield protection'
  },

  // 12. Tomato Spider Mites
  'Tomato_Spider_mites_Two_spotted_spider_mite': {
    primaryFertilizer: 'Potassium Silicate + Balanced NPK micronutrient feed',
    fungicide: 'Abamectin 1.8% EC / Spiromesifen Miticide / Neem Oil (Acaricide)',
    recommendedFormula: 'Neem Oil / Abamectin Miticide + Potassium Silicate cuticle hardener',
    applicationMethod: 'Spider mites are arachnid pests, not fungi. Spray underside of leaves with Abamectin or pure Neem oil emulsion. Apply Potassium Silicate to stiffen plant epidermal cells against mite piercing.',
    nitrogenGuideline: 'CRITICAL: Avoid excessive nitrogen fertilizing. High nitrogen increases free amino acid content in plant sap, attracting massive mite explosions.',
    dosageNote: '1 ml Abamectin or 5 ml Neem Oil + 2 ml mild soap per liter water.',
    organicAlternative: 'Release Phytoseiulus persimilis predatory mites or spray horticultural insecticidal soap.',
    actionPriority: 'High - Rapid foliage desiccation risk'
  },

  // 13. Tomato Target Spot
  'Tomato__Target_Spot': {
    primaryFertilizer: 'Calcium & Potassium blend (12-0-44 + Calcium)',
    fungicide: 'Azoxystrobin (Amistar) / Chlorothalonil 720 SC',
    recommendedFormula: 'Azoxystrobin systemic fungicide + Balanced calcium fertilizer',
    applicationMethod: 'Apply Azoxystrobin or Chlorothalonil at the first sign of pinpoint brown concentric lesions. Prune plant canopy to improve air circulation and sunlight penetration.',
    nitrogenGuideline: 'Balanced NPK feeding throughout vegetative and harvest stages.',
    dosageNote: '1 ml Azoxystrobin or 2 ml Chlorothalonil per liter of clean water.',
    organicAlternative: 'Liquid copper soap + sulfur dust (do not use sulfur within 2 weeks of oil sprays).',
    actionPriority: 'Moderate - Protects stem and fruit from rotting'
  },

  // 14. Tomato Yellow Leaf Curl Virus
  'Tomato__Tomato_YellowLeaf__Curl_Virus': {
    primaryFertilizer: 'Foliar Micronutrients (Zinc, Iron, Manganese, Boron) + Liquid Seaweed',
    fungicide: 'Imidacloprid 17.8% SL / Acetamiprid / Neem Oil (Whitefly Vector Control)',
    recommendedFormula: 'Foliar Micronutrient Boost + Systemic Whitefly Vector Management',
    applicationMethod: 'Viruses cannot be cured with chemical sprays once inside plant cells. Apply Imidacloprid or Neem Oil to exterminate Whitefly insect vectors. Feed foliar micronutrients to support remaining foliage.',
    nitrogenGuideline: 'Light balanced NPK + micronutrient support. Do not over-fertilize stunned plants.',
    dosageNote: '0.5 ml Imidacloprid per liter water. Install yellow sticky traps (1 trap per 100 sq ft).',
    organicAlternative: 'Yellow sticky traps + 5ml/L Neem oil spray + reflective silver plastic mulch.',
    actionPriority: 'Urgent Vector Control - Quarantine infected crops'
  },

  // 15. Tomato Mosaic Virus
  'Tomato__Tomato_mosaic_virus': {
    primaryFertilizer: 'Bio-stimulant + Seaweed Extract + High Potassium (0-0-50)',
    fungicide: 'No chemical cure. Strict sanitation with TSP / Skim Milk disinfectant',
    recommendedFormula: 'Seaweed Extract & Bio-stimulant boost + Strict Tool Sanitation & Rouging',
    applicationMethod: 'Eradicate and incinerate severely stunted plants (do not compost). Disinfect pruning shears in 10% TSP (Trisodium Phosphate) or 20% non-fat dry milk solution. Feed mild bio-stimulants to unaffected crops.',
    nitrogenGuideline: 'Avoid heavy nitrogen which accentuates viral distortion.',
    dosageNote: '2 ml Liquid Seaweed Extract per liter water foliar spray.',
    organicAlternative: 'Wash hands and tools with whole milk or soap before touching plants; plant resistant hybrid seeds.',
    actionPriority: 'Quarantine & Sanitation - Mechanical transmission'
  },

  // 16. Cucumber Downy Mildew
  'Cucumber_Downy_mildew': {
    primaryFertilizer: 'Potassium Sulfate (0-0-50) + Calcium Chelate fortifier',
    fungicide: 'Mancozeb 75% WP + Dimethomorph / Cymoxanil (Curzate)',
    recommendedFormula: 'Dimethomorph / Mancozeb systemic fungicide + Potassium soil feed',
    applicationMethod: 'Spray systemic fungicide on leaf undersides every 5-7 days. Avoid overhead irrigation and apply potassium to strengthen cucumber leaf cuticles.',
    nitrogenGuideline: 'Reduce nitrogen; excess nitrogen fosters lush vine growth highly susceptible to downy mildew water-mold.',
    dosageNote: '2.5g Mancozeb + 1g Dimethomorph per liter water. Spray early morning.',
    organicAlternative: 'Copper hydroxide (Kocide) at 2g/L + Bacillus amyloliquefaciens foliar spray.',
    actionPriority: 'High - Fast-moving cucurbit infection'
  },

  // 17. Cucumber Powdery Mildew
  'Cucumber_Powdery_mildew': {
    primaryFertilizer: 'Potassium Silicate + Balanced NPK (19-19-19)',
    fungicide: 'Myclobutanil / Azoxystrobin or Sulfur-based fungicide',
    recommendedFormula: 'Sulfur / Azoxystrobin protective spray + Potassium Silicate booster',
    applicationMethod: 'Apply wettable sulfur or Azoxystrobin on both sides of leaves upon first white powdery talc patches. Ensure adequate trellis airflow.',
    nitrogenGuideline: 'Moderate nitrogen. High nitrogen softens leaf tissues, accelerating powdery mildew mycelium spread.',
    dosageNote: '2g Wettable Sulfur or 1 ml Azoxystrobin per liter of water.',
    organicAlternative: 'Potassium bicarbonate (3g/L) with horticultural oil or pure milk spray (1:9 ratio).',
    actionPriority: 'Moderate - High yield protection'
  },

  // 18. Cucumber Healthy
  'Cucumber_healthy': {
    primaryFertilizer: 'Balanced Cucurbit NPK (15-15-15 or 12-12-17 with Magnesium)',
    fungicide: 'None required',
    recommendedFormula: 'Regular Cucurbit balanced feeding schedule',
    applicationMethod: 'Side-dress with balanced NPK every 2-3 weeks during vine growth and fruiting. Maintain consistent drip irrigation.',
    nitrogenGuideline: 'Balanced nitrogen during vegetative stage; transition to higher potassium during fruit formation.',
    dosageNote: '15g NPK per cucumber hill every 3 weeks.',
    organicAlternative: 'Vermicompost + seaweed extract drench.',
    actionPriority: 'Maintenance - Vibrant healthy cucumber vines'
  }
};

// Complete Medical Data for all classes & crops
export const MEDICAL_DISEASE_DATA = {
  'Tomato_Early_blight': {
    disease_name: 'Tomato_Early_blight',
    crop_type: 'Tomato',
    symptoms: 'Small, dark brown to black spots with concentric rings ("target-board" appearance) developing primarily on older, lower leaves first. Leaves around spots turn yellow (chlorosis) and prematurely drop.',
    causes: 'Alternaria solani fungal pathogen. Spores overwinter in infected crop debris and soil, thriving in warm temperatures (24-29°C / 75-85°F) with high relative humidity and prolonged leaf wetness.',
    prevention: 'Apply straw or plastic mulch to prevent rain-splash from soil, prune lower foliage 12 inches above ground, rotate crops on a 3-year schedule with non-solanaceous plants, and ensure wide row spacing.',
    treatment: 'Spray protective copper-based fungicides, Mancozeb, or Chlorothalonil every 7-10 days upon early detection. Remove and discard heavily spotted bottom leaves.'
  },
  'Tomato_Late_blight': {
    disease_name: 'Tomato_Late_blight',
    crop_type: 'Tomato',
    symptoms: 'Large, dark, water-soaked oily spots on leaves and stems that rapidly turn purplish-black. In moist conditions, delicate white fuzzy fungal mold appears on leaf undersides. Fruit develops greasy brown firm rot.',
    causes: 'Phytophthora infestans (oomycete water mold). Favored by cool, wet, cloudy, and humid weather (15-22°C / 60-72°F). Spores can travel miles on wind currents.',
    prevention: 'Plant certified blight-resistant varieties (e.g., Defiant, Mountain Magic), eliminate volunteer tomato plants, avoid overhead sprinklers, and maximize airflow.',
    treatment: 'Immediately apply systemic curative fungicides (e.g., Metalaxyl, Cymoxanil) combined with protective Mancozeb. Pull and incinerate entire infected vines if disease covers >30% of canopy.'
  },
  'Tomato_Bacterial_spot': {
    disease_name: 'Tomato_Bacterial_spot',
    crop_type: 'Tomato',
    symptoms: 'Small (under 3mm), dark, water-soaked circular to angular lesions with a distinct yellow halo. Leaves turn yellow, dry out, and drop. Fruit displays raised, scabby, blister-like dark spots.',
    causes: 'Xanthomonas campestris pv. vesicatoria bacteria, spread rapidly by wind-driven rain, sprinkler splashes, contaminated seeds, and hands or pruning shears.',
    prevention: 'Use hot-water treated or certified disease-free seeds, avoid handling wet plants, disinfect pruning shears between cuts, and avoid overhead sprinkler systems.',
    treatment: 'Spray fixed copper fungicides tank-mixed with Mancozeb weekly during humid periods. Prune affected branches only when foliage is completely dry.'
  },
  'Tomato_Leaf_Mold': {
    disease_name: 'Tomato_Leaf_Mold',
    crop_type: 'Tomato',
    symptoms: 'Pale yellow to light green blotches with indefinite margins on upper leaf surfaces. A velvety, olive-green to grayish-purple mold develops on the corresponding underside.',
    causes: 'Passalora fulva (Cladosporium fulvum) fungus, prevalent in greenhouses, high tunnels, and poorly ventilated humid gardens when relative humidity exceeds 85%.',
    prevention: 'Increase greenhouse ventilation with exhaust fans, lower ambient humidity below 80%, prune dense canopy to allow light penetration, and water strictly at base.',
    treatment: 'Apply copper hydroxide, sulfur, or Difenoconazole fungicides on leaf undersides. Remove and bag lower moldy foliage.'
  },
  'Tomato_Septoria_leaf_spot': {
    disease_name: 'Tomato_Septoria_leaf_spot',
    crop_type: 'Tomato',
    symptoms: 'Numerous small, circular spots (1-3mm) with dark brown margins and light gray/tan centers. Tiny black pinprick specks (pycnidia spore bodies) appear in center of lesions.',
    causes: 'Septoria lycopersici fungus, which overwinters on solanaceous weeds and previous year crop residues, spreading through splashing rain and overhead watering.',
    prevention: 'Prune lower leaves to maintain ground clearance, apply clean straw mulch, practice 3-year crop rotation, and eradicate nightshade family weeds.',
    treatment: 'Apply Chlorothalonil, Mancozeb, or copper-based fungicides at the first sign of bottom spots. Reapply at 7 to 10 day intervals.'
  },
  'Tomato_Spider_mites_Two_spotted_spider_mite': {
    disease_name: 'Tomato_Spider_mites_Two_spotted_spider_mite',
    crop_type: 'Tomato',
    symptoms: 'Fine yellow-white stippling or pinprick speckling on top of leaves. Fine silken webbing appears between stems and under leaves. Leaves turn bronzed, crisp, and die.',
    causes: 'Tetranychus urticae (Two-Spotted Spider Mite). Rapid breeding occurs in hot, dry, dusty environmental conditions (above 30°C / 86°F) and low humidity.',
    prevention: 'Regularly mist or hose down plant foliage with strong water streams to disrupt webbing, avoid dusty paths near crops, and introduce beneficial predatory mites.',
    treatment: 'Spray cold-pressed Neem oil emulsion (5ml/L), insecticidal soap, or specific miticides (Abamectin, Spiromesifen) thoroughly under leaves in the evening.'
  },
  'Tomato__Target_Spot': {
    disease_name: 'Tomato__Target_Spot',
    crop_type: 'Tomato',
    symptoms: 'Small, pinpoint brown spots on leaves with concentric ring patterns and yellow halos. Lesions expand up to 10mm, coalescing and causing severe blighting on leaves, stems, and sunken fruit spots.',
    causes: 'Corynespora cassiicola fungus, requiring warm temperatures (20-28°C) and prolonged leaf moisture (more than 16 hours of continuous humidity).',
    prevention: 'Maintain wide plant spacing for fast canopy drying, stake and prune plants, rotate away from cucurbits/solanaceous crops, and avoid overhead irrigation.',
    treatment: 'Apply Azoxystrobin, Chlorothalonil, or copper fungicides on a 7-14 day schedule starting at initial disease appearance.'
  },
  'Tomato__Tomato_YellowLeaf__Curl_Virus': {
    disease_name: 'Tomato__Tomato_YellowLeaf__Curl_Virus',
    crop_type: 'Tomato',
    symptoms: 'Leaves curl dramatically upward and inward, exhibiting bright yellowing along margins and severe puckering/crinkling. Plant growth is severely stunted and bush-like with no fruit set.',
    causes: 'Tomato yellow leaf curl virus (TYLCV), transmitted exclusively by Silverleaf Whiteflies (Bemisia tabaci). Not spread by mechanical contact or seeds.',
    prevention: 'Use 50-mesh insect-proof netting in greenhouses, install yellow sticky cards for whitefly trapping, use reflective silver mulches, and grow TYLCV-resistant hybrids.',
    treatment: 'No chemical cure exists for viral infections. Immediately rogue out and destroy infected plants. Spray Imidacloprid, Acetamiprid, or Neem oil to eliminate whitefly vector populations.'
  },
  'Tomato__Tomato_mosaic_virus': {
    disease_name: 'Tomato__Tomato_mosaic_virus',
    crop_type: 'Tomato',
    symptoms: 'Mottled alternating light and dark green patterns on leaves, leaf distortion (fern-like or shoe-string effect), blistered foliage, and uneven fruit ripening with internal browning.',
    causes: 'Tomato mosaic virus (ToMV), an exceptionally stable virus transmitted mechanically through contaminated hands, tools, grafting, clothing, and infected seeds.',
    prevention: 'Wash hands with soap/milk before handling plants, sanitize pruning tools in 10% TSP or 20% skim milk solution, plant certified virus-free seeds, and prohibit tobacco use in greenhouses.',
    treatment: 'Remove and burn all infected plants immediately. Do not compost. Sterilize trellising and stakes before next planting season.'
  },
  'Tomato_healthy': {
    disease_name: 'Tomato_healthy',
    crop_type: 'Tomato',
    symptoms: 'Vibrant, deep green foliage with uniform leaf texture, sturdy erect stems, and no lesions, molds, discolorations, or wilting. Normal flowering and fruit formation.',
    causes: 'Optimal balanced growing environment with sufficient sunlight, appropriate soil pH (6.2-6.8), balanced N-P-K nutrients, and clean irrigation.',
    prevention: 'Maintain regular deep watering at soil level, provide trellis support, mulch soil base, and monitor weekly for early insect or fungal signs.',
    treatment: 'No treatment required. Maintain scheduled balanced feeding and standard cultural care.'
  },
  'Potato___Early_blight': {
    disease_name: 'Potato___Early_blight',
    crop_type: 'Potato',
    symptoms: 'Dark brown to black circular lesions with distinct concentric target rings on older lower leaves. Affected leaves turn yellow around spots and die. Tubers may exhibit dark, sunken corky dry rot.',
    causes: 'Alternaria solani fungal pathogen, surviving in soil and infected potato debris, favored by alternating wet and dry periods during warm weather.',
    prevention: 'Plant certified disease-free seed potatoes, maintain adequate nitrogen and potassium levels, practice 3-4 year crop rotations, and hill soil properly.',
    treatment: 'Apply Chlorothalonil, Mancozeb, or Azoxystrobin fungicides beginning at row closure or when bottom lesions are first detected.'
  },
  'Potato___Late_blight': {
    disease_name: 'Potato___Late_blight',
    crop_type: 'Potato',
    symptoms: 'Large, dark green to brown water-soaked irregular spots on leaves that turn purplish-black. Undersides show delicate white spore fuzz during morning dew. Tubers develop dry brown granular rot.',
    causes: 'Phytophthora infestans oomycete, famous as the cause of the Irish Potato Famine. Multiplies explosively under cool (12-24°C), misty, and foggy conditions.',
    prevention: 'Plant certified disease-free tubers, destroy cull potato piles, space rows for optimal airflow, and avoid late evening sprinkler irrigation.',
    treatment: 'Apply systemic fungicides (Cymoxanil + Mancozeb / Metalaxyl) immediately upon detection. Destroy blighted vines 2 weeks before harvest to prevent tuber contamination.'
  },
  'Potato___healthy': {
    disease_name: 'Potato___healthy',
    crop_type: 'Potato',
    symptoms: 'Full, vigorous green canopy with healthy compound leaves. No wilting, chlorosis, or necrotic spotting. Tubers are firm, smooth, and clean.',
    causes: 'Well-drained soil with adequate organic matter, proper earthing up, balanced high-potassium nutrition, and clean certified seed stock.',
    prevention: 'Maintain consistent soil moisture, inspect under leaves regularly, hill rows to protect developing tubers from sunlight and pests.',
    treatment: 'None required. Continue standard hilling, watering, and harvest preparation.'
  },
  'Pepper__bell___Bacterial_spot': {
    disease_name: 'Pepper__bell___Bacterial_spot',
    crop_type: 'Pepper Bell',
    symptoms: 'Small, circular, yellowish-green spots on leaves that darken to brown with water-soaked borders. Severe infections cause complete lower leaf drop (defoliation). Fruit displays raised rough scab-like lesions.',
    causes: 'Xanthomonas campestris pv. vesicatoria bacteria, spread rapidly through splashing rain, sprinkler irrigation, high humidity, and contaminated seeds.',
    prevention: 'Plant resistant bell pepper hybrids, avoid overhead irrigation, sanitize tools, and rotate fields with non-solanaceous crops for 2-3 years.',
    treatment: 'Apply copper hydroxide bactericide tank-mixed with Mancozeb at 5-7 day intervals. Prune diseased lower foliage only during sunny, dry conditions.'
  },
  'Pepper__bell___healthy': {
    disease_name: 'Pepper__bell___healthy',
    crop_type: 'Pepper Bell',
    symptoms: 'Lush dark-green foliage, sturdy branching structure, vibrant white blossoms, and smooth firm bell peppers without blemishes or sunscald.',
    causes: 'Adequate warm temperature (21-29°C), rich well-drained loam soil, balanced nutrition with magnesium, and consistent drip irrigation.',
    prevention: 'Apply organic mulch, maintain regular watering to prevent blossom end rot (calcium deficiency), and provide support stakes for heavy fruit yields.',
    treatment: 'None required. Continue routine fertilization and cultural maintenance.'
  }
};

/**
 * Standardizes any disease string format (with spaces, underscores, camelCase) into a clean key
 */
function normalizeKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Returns comprehensive fertilizer & fungicide guidance for any disease name
 */
export function getFertilizerRecommendation(diseaseName) {
  if (!diseaseName) return FERTILIZER_RECOMMENDATIONS['Tomato_healthy'];

  // Direct exact key match
  if (FERTILIZER_RECOMMENDATIONS[diseaseName]) {
    return FERTILIZER_RECOMMENDATIONS[diseaseName];
  }

  const cleanQuery = normalizeKey(diseaseName);

  // Exact normalized match against all known keys
  for (const [key, value] of Object.entries(FERTILIZER_RECOMMENDATIONS)) {
    if (normalizeKey(key) === cleanQuery) {
      return value;
    }
  }

  // Keyword / Substring intelligent heuristic match
  if (cleanQuery.includes('potatolateblight') || (cleanQuery.includes('potato') && cleanQuery.includes('lateblight'))) {
    return FERTILIZER_RECOMMENDATIONS['Potato___Late_blight'];
  }
  if (cleanQuery.includes('potatoearlyblight') || (cleanQuery.includes('potato') && cleanQuery.includes('earlyblight'))) {
    return FERTILIZER_RECOMMENDATIONS['Potato___Early_blight'];
  }
  if (cleanQuery.includes('potatohealthy') || (cleanQuery.includes('potato') && cleanQuery.includes('healthy'))) {
    return FERTILIZER_RECOMMENDATIONS['Potato___healthy'];
  }
  if (cleanQuery.includes('pepper') && cleanQuery.includes('bacterialspot')) {
    return FERTILIZER_RECOMMENDATIONS['Pepper__bell___Bacterial_spot'];
  }
  if (cleanQuery.includes('pepper') && cleanQuery.includes('healthy')) {
    return FERTILIZER_RECOMMENDATIONS['Pepper__bell___healthy'];
  }
  if (cleanQuery.includes('tomatolateblight') || (cleanQuery.includes('tomato') && cleanQuery.includes('lateblight'))) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_Late_blight'];
  }
  if (cleanQuery.includes('tomatoearlyblight') || (cleanQuery.includes('tomato') && cleanQuery.includes('earlyblight'))) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_Early_blight'];
  }
  if (cleanQuery.includes('tomatobacterialspot') || (cleanQuery.includes('tomato') && cleanQuery.includes('bacterial'))) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_Bacterial_spot'];
  }
  if (cleanQuery.includes('leafmold')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_Leaf_Mold'];
  }
  if (cleanQuery.includes('septoria')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_Septoria_leaf_spot'];
  }
  if (cleanQuery.includes('spidermite') || cleanQuery.includes('mite')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_Spider_mites_Two_spotted_spider_mite'];
  }
  if (cleanQuery.includes('targetspot')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato__Target_Spot'];
  }
  if (cleanQuery.includes('yellowleafcurl') || cleanQuery.includes('curlvirus')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato__Tomato_YellowLeaf__Curl_Virus'];
  }
  if (cleanQuery.includes('mosaicvirus')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato__Tomato_mosaic_virus'];
  }
  if (cleanQuery.includes('healthy')) {
    return FERTILIZER_RECOMMENDATIONS['Tomato_healthy'];
  }

  // Broad generic fallback if non-standard or external disease
  return {
    primaryFertilizer: 'Balanced NPK Fertilizer (10-10-10 or 15-15-15) + Micronutrients',
    fungicide: 'Broad-spectrum Copper Hydroxide (2.5g/L) or cold-pressed Neem oil (5ml/L)',
    recommendedFormula: 'Broad-Spectrum Protective Copper Spray + Balanced NPK Soil Nutrient Booster',
    applicationMethod: 'Apply balanced NPK fertilizer in circular furrow around root drip line. Spray broad-spectrum organic copper or sulfur-based fungicide on leaves at sunrise or sunset.',
    nitrogenGuideline: 'Maintain balanced nitrogen to support plant vegetative vigor without promoting overly soft, moisture-vulnerable leaf tissue.',
    dosageNote: '15g NPK per plant base monthly + 2g Copper fungicide per liter foliar spray every 7-10 days.',
    organicAlternative: 'Neem seed oil (5ml/L) + Trichoderma bio-agent soil drench.',
    actionPriority: 'Moderate - Monitor and treat weekly'
  };
}

/**
 * Returns comprehensive medical disease data (Symptoms, Causes, Prevention, Treatment)
 */
export function getDiseaseMedicalData(diseaseName) {
  if (!diseaseName) return MEDICAL_DISEASE_DATA['Tomato_healthy'];

  // Direct exact key match
  if (MEDICAL_DISEASE_DATA[diseaseName]) {
    return MEDICAL_DISEASE_DATA[diseaseName];
  }

  const cleanQuery = normalizeKey(diseaseName);

  for (const [key, value] of Object.entries(MEDICAL_DISEASE_DATA)) {
    if (normalizeKey(key) === cleanQuery) {
      return value;
    }
  }

  // Substring check
  for (const [key, value] of Object.entries(MEDICAL_DISEASE_DATA)) {
    const cleanKey = normalizeKey(key);
    if (cleanQuery.includes(cleanKey) || cleanKey.includes(cleanQuery)) {
      return value;
    }
  }

  // Fallback constructed data
  const isHealthy = cleanQuery.includes('healthy');
  return {
    disease_name: diseaseName,
    crop_type: cleanQuery.includes('potato') ? 'Potato' : cleanQuery.includes('pepper') ? 'Pepper Bell' : 'Tomato',
    symptoms: isHealthy 
      ? 'Foliage is vibrant green, firm, and displaying optimal growth without discolorations, spots, or wilting.' 
      : `Visible leaf spotting, discoloration, or tissue stress characteristic of ${diseaseName.replace(/_/g, ' ')}.`,
    causes: isHealthy 
      ? 'Optimal agricultural conditions, balanced water and nutrient supply.' 
      : `Fungal, bacterial, or environmental pathogen exposure under favorable temperature and humidity conditions.`,
    prevention: 'Practice crop rotation, maintain balanced fertilizer regimens, sanitize tools, and ensure drip irrigation to avoid wet foliage.',
    treatment: isHealthy 
      ? 'No treatment needed. Continue standard watering and crop management.' 
      : 'Remove infected leaves, apply broad-spectrum copper or bio-fungicide, and ensure adequate spacing and airflow.'
  };
}
