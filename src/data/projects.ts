export type Project = {
  slug: string;
  number: string;
  title: string;
  category: 'Applied AI' | 'Systems' | 'Software';
  period: string;
  subtitle: string;
  description: string;
  role: string;
  roleDetail: string;
  technologies: string[];
  metric: string;
  metricLabel: string;
  problem: string;
  approach: string[];
  decisions: { title: string; text: string }[];
  results: { value: string; label: string }[];
  resultNote: string;
  limitations: string;
  takeaway: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: 'tb-screening', number: '01', title: 'Cough-based TB screening.', category: 'Applied AI', period: '2025–2026',
    subtitle: 'TB-Turing / HeAR',
    description: 'Exploring cough-based TB screening with foundation audio embeddings and patient-level machine learning.',
    role: 'HeAR workstream · Team research',
    roleDetail: 'My work focused on the HeAR pipeline within a wider team research project. The Wav2Vec2 programme was shared team work.',
    technologies: ['Python', 'PyTorch', 'Google HeAR', 'HPC'],
    metric: '0.830', metricLabel: 'DS2 symptom-assisted AUROC',
    problem: 'This project evaluates whether cough audio contains useful screening signal and how symptom metadata changes the result.',
    approach: ['Cough windows', 'HeAR embeddings', 'Patient bags', 'Attention MIL', 'Patient-level evaluation'],
    decisions: [
      { title: 'Use patient-level evaluation.', text: 'Group multiple cough clips into patient bags and split at patient level. This keeps clips from the same person from appearing in both training and validation folds.' },
      { title: 'Aggregate variable-length patient bags.', text: 'Use gated-attention multiple-instance learning over frozen HeAR embeddings to aggregate variable-length patient bags.' },
      { title: 'Separate audio from context.', text: 'Compare audio-only, basic-metadata and symptom-enhanced configurations. Analyse sensitivity-targeted operating points and bootstrap uncertainty alongside AUROC.' },
    ],
    results: [{ value: '0.745', label: 'DS2 · audio only' }, { value: '0.756', label: 'DS2 · + basic metadata' }, { value: '0.830', label: 'DS2 · + symptoms' }],
    resultNote: 'Pooled retrospective internal cross-validation. Symptom-enhanced AUROC: 0.829575; 95% bootstrap interval 0.801032–0.858900. The separate DS1 audio-only result was 0.850330; DS1 and DS2 are not interchangeable.',
    limitations: 'These are research results, not clinical validation. Symptom availability, dataset shift and threshold selection limit how the numbers can be interpreted. Patient data and private prediction files are not published here.',
    takeaway: 'The result depends on the patient-level split, the input features and the uncertainty around the reported estimates.',
  },
  {
    slug: 'parallel-computing', number: '02', title: 'OpenMP and CUDA implementations.', category: 'Systems', period: '2026',
    subtitle: 'Count Gliders / Histogram / Emboss',
    description: 'Individual coursework implementing and optimizing three supplied CPU-reference algorithms in OpenMP and CUDA, with correctness checks, profiling and end-to-end timing.',
    role: 'Individual coursework',
    roleDetail: 'I authored the OpenMP and CUDA implementations within a supplied coursework framework. The original serial reference and assignment harness were supplied.',
    technologies: ['C/C++', 'CUDA', 'OpenMP', 'Nsight'],
    metric: '3', metricLabel: 'OpenMP + CUDA workloads',
    problem: 'Parallel hardware creates opportunities, but not every workload benefits equally. The task was to implement three workloads, measure their full execution cost and understand where the time went.',
    approach: ['Serial reference', 'OpenMP / CUDA', 'Verify outputs', 'Profile', 'Compare end-to-end'],
    decisions: [
      { title: 'Match the implementation to the workload.', text: 'Use bit-mask lookup tables and reductions for Count Gliders, private histograms for contention control, and two-dimensional thread mapping for image convolution.' },
      { title: 'Work with the GPU memory hierarchy.', text: 'Use constant memory, warp ballot/popcount, grid-stride loops and shared-memory accumulation where the access patterns support them.' },
      { title: 'Measure more than the kernel.', text: 'Include allocation, host–device transfer, execution and cleanup. The histogram example is especially useful: OpenMP can outperform end-to-end CUDA when overhead dominates.' },
    ],
    results: [{ value: 'Count Gliders', label: 'OpenMP + CUDA' }, { value: 'Histogram', label: 'OpenMP + CUDA' }, { value: 'Emboss', label: 'OpenMP + CUDA' }],
    resultNote: 'Submitted measurements include 2048 × 2048 Count Gliders and Emboss workloads plus five-million-value Histogram runs, using a Release build and 100 iterations on a Ryzen 7600X3D and RTX 5060. End-to-end timings include transfer/allocation costs. These historical results have not been rerun for this website.',
    limitations: 'Performance is hardware- and workload-specific. The published demonstration harness was added later; it should not be confused with the original supplied assessment framework.',
    takeaway: 'The comparison is only meaningful when transfer, allocation and workload-specific behavior are included.',
    repo: 'https://github.com/Aio777/parallel-computing-cuda-openmp',
  },
  {
    slug: 'recola', number: '03', title: 'Android property management.', category: 'Software', period: '2025',
    subtitle: 'ReCoLA / Android property management',
    description: 'Six-person Android application; my property and maps contribution covered CRUD, geocoding, proximity sorting, supplier assignment, image handling and related tests.',
    role: 'Property & maps · Six-person team',
    roleDetail: 'My supported contribution covers property CRUD, Google Maps/geocoding, proximity sorting, supplier assignment, internal image handling and related tests.',
    technologies: ['Kotlin', 'Jetpack Compose', 'Room', 'Google Maps'],
    metric: '6', metricLabel: 'Person development team',
    problem: 'Property management information is scattered across addresses, images and related records. ReCoLA brought these workflows into an Android application with local persistence and map-based navigation.',
    approach: ['Compose interface', 'Property workflow', 'Room storage', 'Geocoding', 'Map / list'],
    decisions: [
      { title: 'Connect the feature across layers.', text: 'Build property creation and editing through Compose state, persistence and navigation, rather than treating the map as a disconnected view.' },
      { title: 'Define behavior when location is missing.', text: 'Offer proximity sorting when location is available and a predictable alphabetical fallback when it is not.' },
      { title: 'Store images with property records.', text: 'Use internal image files alongside stored property records, with supplier assignment and property/map test cases connecting the workflow.' },
    ],
    results: [{ value: '25', label: 'Attributed commits' }, { value: '6', label: 'Team members' }, { value: 'End to end', label: 'Property / map workflow' }],
    resultNote: 'Contribution scope is supported by the project evidence and attributed Git history. Tenant, billing and maintenance features belong to the wider team application.',
    limitations: 'This was an academic team application, not a production service. Maps and geocoding need connectivity; “fully offline” would overstate the design. The visual on this page is a schematic using fictional property labels.',
    takeaway: 'The property workflow depends on permissions, persistence, location data and failure handling across the application.',
  },
  {
    slug: 'heston', number: '04', title: 'Heston pricing and calibration.', category: 'Systems', period: '2024–2025',
    subtitle: 'Individual dissertation / Heston model',
    description: 'An individual dissertation comparing CPU COS pricing, batched CuPy calibration and a PyTorch surrogate for Heston-model calibration to SPX options.',
    role: 'Individual dissertation · COM3610',
    roleDetail: 'I implemented the Heston pricing and calibration pipeline: NumPy Fourier–COS pricing, batched CuPy evaluation, bounded L-BFGS-B optimisation and a ten-feature PyTorch surrogate trained on 600,000 synthetic samples.',
    technologies: ['Python', 'NumPy / CuPy', 'PyTorch', 'SciPy'],
    metric: '3', metricLabel: 'CPU, GPU and surrogate paths',
    problem: 'Repeated option pricing can make model calibration expensive. My dissertation compared a NumPy CPU path, batched GPU evaluation and a learned surrogate to measure the trade-off between runtime and price-space error.',
    approach: ['Filter SPX contracts', 'COS pricing', 'Bounded optimisation', 'Neural surrogate', 'Compare trade-offs'],
    decisions: [
      { title: 'Implement CPU and GPU pricing paths.', text: 'Implement Fourier–COS pricing with a NumPy CPU path, then evaluate batched pricing with CuPy.' },
      { title: 'Constrain the calibration parameters.', text: 'Use bounded L-BFGS-B optimisation to estimate the Heston parameters from filtered market contracts.' },
      { title: 'Train and evaluate an approximation.', text: 'Train a ten-feature PyTorch surrogate on a 600,000-sample synthetic design. Compare runtime and price-space error together rather than making speed the only objective.' },
    ],
    results: [{ value: '4.92 s', label: 'CPU COS · RMSE 1.661350' }, { value: '2.52 s', label: 'GPU COS · RMSE 1.661350' }, { value: '0.40 s', label: 'Neural surrogate · RMSE 3.660689' }],
    resultNote: 'One retained run used 93 filtered out-of-the-money SPX contracts from 2014-06-02. CPU and GPU COS reached the same retained RMSE; the neural surrogate was faster but less accurate. This run was not independently reproduced for the website.',
    limitations: 'The reported experiment uses a single SPX market snapshot. Broader market-regime generalisation and repeated benchmark reproducibility remain limitations. Restricted market data and model artifacts are not redistributed here.',
    takeaway: 'The surrogate reduced runtime in the retained run, but price error increased and the run was not independently reproduced.',
  },
  {
    slug: 'speech-technology', number: '05', title: 'Speech modelling and detection.', category: 'Applied AI', period: '2026',
    subtitle: 'Speech technology / VAD + GMM',
    description: 'Individual coursework comparing neural voice-activity detectors and classical GMM vowel/speaker modelling across speech corpora.',
    role: 'Individual coursework',
    roleDetail: 'Individual modelling and evaluation work using supplied datasets and practical frontends. The neural VAD and GMM implementations are available in the public repository.',
    technologies: ['Python', 'PyTorch', 'scikit-learn', 'GMM'],
    metric: '7.73%', metricLabel: 'Cross-corpus test EER',
    problem: 'The evaluation compares neural voice-activity detectors and classical models across speech corpora, with the cross-corpus result as the main test.',
    approach: ['Acoustic features', 'Context / sequence', 'Neural VAD', 'Post-processing', 'Cross-corpus test'],
    decisions: [
      { title: 'Compare model families.', text: 'Move from a contextual MLP to bidirectional recurrent models and dilated temporal convolutions, examining how temporal context changes detection.' },
      { title: 'Test on a second corpus.', text: 'Use detection-error trade-off curves and equal error rate to compare the selected systems on a different speech corpus.' },
      { title: 'Compare against GMM baselines.', text: 'Use diagonal-covariance Gaussian mixture models for vowels and speaker identification, comparing mixture complexity, utterance aggregation and UBM-MAP adaptation.' },
    ],
    results: [{ value: '23.77%', label: 'No-context MLP · EER' }, { value: '15.73%', label: 'GRU · EER' }, { value: '7.73%', label: 'Tuned TCN · EER' }],
    resultNote: 'Selected reported cross-corpus results over 495,486 test frames. The tuned TCN includes median post-processing. These figures are retained evaluation results, not a new benchmark run.',
    limitations: 'Datasets, labels and checkpoints are excluded from the public repository. The GMM workflow needs a supplied or replacement MFCC frontend. Closed-set speaker results do not establish general-world identification performance.',
    takeaway: 'The cross-corpus evaluation shows the effect of model family and temporal context; it is not a general speech-recognition claim.',
    repo: 'https://github.com/Aio777/speech-technology-vad-gmm',
  },
  {
    slug: 'productiv', number: '06', title: 'Productiv / Genesys.', category: 'Software', period: '2025–2026',
    subtitle: 'Team-built Rails productivity platform',
    description: 'Team-built Rails 8/PostgreSQL platform with personal and shared tasks, role-based areas, focus support, analytics and gamification.',
    role: 'Academic team project',
    roleDetail: 'Productiv is presented as team project context. The archived source does not establish my personal subsystem ownership, so no individual feature claim is made here.',
    technologies: ['Ruby on Rails', 'PostgreSQL', 'RSpec', 'Stimulus'],
    metric: 'Full stack', metricLabel: 'Team product engineering',
    problem: 'Productiv brings personal tasks, shared projects and focus tools into one multi-role application. The Genesys module provided the setting for this academic team project.',
    approach: ['Role-based interface', 'Controllers', 'Domain services', 'PostgreSQL', 'Tests & CI'],
    decisions: [
      { title: 'Separate domain workflows.', text: 'The team codebase separates services for tasks, teams, assignments, notifications and points from controllers and persistence.' },
      { title: 'Model the product roles.', text: 'The platform contains subscriber, reporter, administrator and public workflows, with authentication and role-based authorisation.' },
      { title: 'Record tests and CI configuration.', text: 'The repository includes RSpec/Capybara tests, performance examples and CI definitions for test, security and lint stages. Their presence is distinct from evidence that every gate passes.' },
    ],
    results: [{ value: 'Tasks', label: 'Individual & shared work' }, { value: 'Focus', label: 'Pomodoro & gamification' }, { value: 'Insights', label: 'Role-based analytics' }],
    resultNote: 'Product capabilities are documented at team level. The public repository is an archive of the team source and does not attribute individual subsystems.',
    limitations: 'Personal implementation allocation and several discovery/process claims remain unverified. Public availability of the archive does not itself grant redistribution rights. The visual is a schematic of the workflow, not a screenshot.',
    takeaway: 'The evidence supports a team-level product architecture, not attribution of individual subsystems.',
    repo: 'https://github.com/Aio777/productiv',
  },
];
