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

  repo?: string;
};

export const projects: Project[] = [
  {
    slug: 'tb-screening', number: '01', title: 'Cough-based TB screening.', category: 'Applied AI', period: '2025–2026',
    subtitle: 'TB-Turing / HeAR',
    description: 'Team research into cough-based TB screening. My HeAR workstream used frozen audio embeddings, patient-level multiple-instance learning and grouped five-fold evaluation.',
    role: 'HeAR workstream · Team research',
    roleDetail: 'I developed the HeAR pipeline: grouping cough embeddings by patient, training attention-based models, and evaluating audio-only and metadata-assisted configurations with grouped five-fold cross-validation, sensitivity-targeted thresholds and bootstrap analysis. The wider project also included a shared Wav2Vec2 workstream.',
    technologies: ['Python', 'PyTorch', 'Google HeAR', 'HPC'],
    metric: '0.830', metricLabel: 'DS2 symptom-assisted AUROC',
    problem: 'The research compared cough-audio models for TB screening and examined how demographic and symptom information affected their predictions. Each patient could contribute several cough recordings, so both prediction and evaluation operated at patient level.',
    approach: ['Cough windows', 'HeAR embeddings', 'Patient bags', 'Attention MIL', 'Patient-level evaluation'],
    decisions: [
      { title: 'Use patient-level evaluation.', text: 'Group multiple cough clips into patient bags and split at patient level. This keeps clips from the same person from appearing in both training and validation folds.' },
      { title: 'Aggregate variable-length patient bags.', text: 'Use gated-attention multiple-instance learning over frozen HeAR embeddings to aggregate variable-length patient bags.' },
      { title: 'Separate audio from context.', text: 'Compare audio-only, basic-metadata and symptom-enhanced configurations. Analyse sensitivity-targeted operating points and bootstrap uncertainty alongside AUROC.' },
    ],
    results: [{ value: '0.745', label: 'DS2 · audio only' }, { value: '0.756', label: 'DS2 · + basic metadata' }, { value: '0.830', label: 'DS2 · + symptoms' }],
    resultNote: 'Pooled retrospective internal cross-validation. Symptom-enhanced AUROC: 0.829575; 95% bootstrap interval 0.801032–0.858900. The separate DS1 audio-only result was 0.850330; DS1 and DS2 are not interchangeable.',
    limitations: 'These are research results, not clinical validation. Symptom availability, dataset shift and threshold selection limit how the numbers can be interpreted. Patient data and private prediction files are not published here.',

  },
  {
    slug: 'parallel-computing', number: '02', title: 'OpenMP and CUDA implementations.', category: 'Systems', period: '2026',
    subtitle: 'Count Gliders / Histogram / Emboss',
    description: 'Implemented and optimised OpenMP and CUDA versions of three supplied algorithms: glider-pattern counting, integer histogramming and an emboss image filter. Compared correctness and end-to-end execution time.',
    role: 'Individual coursework',
    roleDetail: 'I authored the OpenMP and CUDA implementations within a supplied coursework framework. The original serial reference and assignment harness were supplied.',
    technologies: ['C/C++', 'CUDA', 'OpenMP', 'Nsight'],
    metric: '3', metricLabel: 'OpenMP + CUDA workloads',
    problem: 'Count Gliders counts 3 × 3 patterns in a binary grid; Histogram groups integer values into bins; Emboss applies a 3 × 3 image convolution. I implemented OpenMP and CUDA versions of each supplied serial reference, checked their outputs and profiled execution with Nsight.',
    approach: ['Serial reference', 'OpenMP / CUDA', 'Verify outputs', 'Profile', 'Compare end-to-end'],
    decisions: [
      { title: 'Workload-specific algorithms.', text: 'Use bit-mask lookup tables and reductions for Count Gliders, private histograms for contention control, and two-dimensional thread mapping for image convolution.' },
      { title: 'CUDA memory and thread layout.', text: 'Use constant memory, warp ballot/popcount, grid-stride loops and shared-memory accumulation where the access patterns support them.' },
      { title: 'End-to-end timing.', text: 'Include allocation, host–device transfer, execution and cleanup. In the submitted five-million-value histogram comparison, OpenMP took 0.671 ms and CUDA took 2.606 ms including overhead.' },
    ],
    results: [{ value: 'Count Gliders', label: 'OpenMP + CUDA' }, { value: 'Histogram', label: 'OpenMP + CUDA' }, { value: 'Emboss', label: 'OpenMP + CUDA' }],
    resultNote: 'Submitted measurements include 2048 × 2048 Count Gliders and Emboss workloads plus five-million-value Histogram runs, using a Release build and 100 iterations on a Ryzen 7600X3D and RTX 5060. End-to-end timings include transfer/allocation costs. These historical results have not been rerun for this website.',
    limitations: 'Performance is hardware- and workload-specific. The published demonstration harness was added later; it should not be confused with the original supplied assessment framework.',

    repo: 'https://github.com/Aio777/parallel-computing-cuda-openmp',
  },
  {
    slug: 'recola', number: '03', title: 'Android property management.', category: 'Software', period: '2025',
    subtitle: 'ReCoLA / Android property management',
    description: 'Android property-management app built by a six-person team. I implemented property creation and editing, maps and geocoding, proximity sorting, supplier assignment, image handling and related tests.',
    role: 'Property & maps · Six-person team',
    roleDetail: 'I implemented the property and maps features using Kotlin, Jetpack Compose, Room and Google Maps. This included creating, viewing, editing and deleting properties, geocoding addresses, sorting by distance, assigning suppliers, storing images and testing the property/map workflows.',
    technologies: ['Kotlin', 'Jetpack Compose', 'Room', 'Google Maps'],
    metric: '6', metricLabel: 'Person development team',
    problem: 'Property management information is scattered across addresses, images and related records. ReCoLA brought these workflows into an Android application with local persistence and map-based navigation.',
    approach: ['Compose interface', 'Property workflow', 'Room storage', 'Geocoding', 'Map / list'],
    decisions: [
      { title: 'Property editing and persistence.', text: 'Build property creation and editing through Compose state, persistence and navigation, rather than treating the map as a disconnected view.' },
      { title: 'Location permissions and sorting.', text: 'Offer proximity sorting when location is available and a predictable alphabetical fallback when it is not.' },
      { title: 'Property images and suppliers.', text: 'Use internal image files alongside stored property records, with supplier assignment and property/map test cases connecting the workflow.' },
    ],
    results: [{ value: '25', label: 'Attributed commits' }, { value: '6', label: 'Team members' }, { value: 'End to end', label: 'Property / map workflow' }],
    resultNote: 'Contribution scope is supported by the project evidence and attributed Git history. Tenant, billing and maintenance features belong to the wider team application.',
    limitations: 'This was an academic team application, not a production service. Maps and geocoding need connectivity; “fully offline” would overstate the design. The visual on this page is a schematic using fictional property labels.',

  },
  {
    slug: 'heston', number: '04', title: 'Heston pricing and calibration.', category: 'Systems', period: '2024–2025',
    subtitle: 'Individual dissertation / Heston model',
    description: 'An individual dissertation comparing CPU COS pricing, batched CuPy calibration and a PyTorch surrogate for Heston-model calibration to SPX options.',
    role: 'Individual dissertation · COM3610',
    roleDetail: 'I implemented the Heston pricing and calibration pipeline: NumPy Fourier–COS pricing, batched CuPy evaluation, bounded L-BFGS-B optimisation and a ten-feature PyTorch surrogate trained on 600,000 synthetic samples.',
    technologies: ['Python', 'NumPy / CuPy', 'PyTorch', 'SciPy'],
    metric: '3', metricLabel: 'CPU, GPU and surrogate paths',
    problem: 'My individual dissertation investigated calibration of the Heston stochastic-volatility model to SPX option prices. Calibration repeatedly prices contracts while estimating model parameters. I compared CPU COS pricing, batched CuPy GPU pricing and a neural approximation, measuring calibration time and pricing error.',
    approach: ['Filter SPX contracts', 'COS pricing', 'Bounded optimisation', 'Neural surrogate', 'Compare trade-offs'],
    decisions: [
      { title: 'NumPy and CuPy COS pricing.', text: 'Implement Fourier–COS pricing with a NumPy CPU path, then evaluate batched pricing with CuPy.' },
      { title: 'Bounded L-BFGS-B calibration.', text: 'Use bounded L-BFGS-B optimisation to estimate the Heston parameters from filtered market contracts.' },
      { title: 'Ten-feature neural surrogate.', text: 'Train a ten-feature PyTorch surrogate on a 600,000-sample synthetic design. Compare runtime and price-space error together rather than making speed the only objective.' },
    ],
    results: [{ value: '4.92 s', label: 'CPU COS · RMSE 1.661350' }, { value: '2.52 s', label: 'GPU COS · RMSE 1.661350' }, { value: '0.40 s', label: 'Neural surrogate · RMSE 3.660689' }],
    resultNote: 'One retained run used 93 filtered out-of-the-money SPX contracts from 2014-06-02. CPU and GPU COS reached the same retained RMSE; the neural surrogate was faster but less accurate. This run was not independently reproduced for the website.',
    limitations: 'The reported experiment uses a single SPX market snapshot. Broader market-regime generalisation and repeated benchmark reproducibility remain limitations. Restricted market data and model artifacts are not redistributed here.',

  },
  {
    slug: 'speech-technology', number: '05', title: 'Speech modelling and detection.', category: 'Applied AI', period: '2026',
    subtitle: 'Speech technology / VAD + GMM',
    description: 'Two individual coursework tasks: neural voice-activity detection evaluated across speech corpora, and Gaussian mixture models for vowel classification and speaker identification.',
    role: 'Individual coursework',
    roleDetail: 'Individual modelling and evaluation work using supplied datasets and practical frontends. The neural VAD and GMM implementations are available in the public repository.',
    technologies: ['Python', 'PyTorch', 'scikit-learn', 'GMM'],
    metric: '7.73%', metricLabel: 'Cross-corpus test EER',
    problem: 'The first task classified speech and silence using neural voice-activity detectors, testing generalisation on a separate speech corpus. The second used diagonal-covariance Gaussian mixture models for vowel classification and closed-set speaker identification. These were separate experiments with different evaluation tasks.',
    approach: ['Acoustic features', 'Context / sequence', 'Neural VAD', 'Post-processing', 'Cross-corpus test'],
    decisions: [
      { title: 'MLP, recurrent and temporal-convolutional VAD.', text: 'Move from a contextual MLP to bidirectional recurrent models and dilated temporal convolutions, examining how temporal context changes detection.' },
      { title: 'Cross-corpus VAD evaluation.', text: 'Use detection-error trade-off curves and equal error rate to compare the selected systems on a different speech corpus.' },
      { title: 'GMM vowel and speaker classification.', text: 'Use diagonal-covariance Gaussian mixture models for vowels and speaker identification, comparing mixture complexity, utterance aggregation and UBM-MAP adaptation.' },
    ],
    results: [{ value: '23.77%', label: 'No-context MLP · EER' }, { value: '15.73%', label: 'GRU · EER' }, { value: '7.73%', label: 'Tuned TCN · EER' }],
    resultNote: 'Selected reported cross-corpus results over 495,486 test frames. The tuned TCN includes median post-processing. These figures are retained evaluation results, not a new benchmark run.',
    limitations: 'Datasets, labels and checkpoints are excluded from the public repository. The GMM workflow needs a supplied or replacement MFCC frontend. Closed-set speaker results do not establish general-world identification performance.',

    repo: 'https://github.com/Aio777/speech-technology-vad-gmm',
  },
  {
    slug: 'productiv', number: '06', title: 'Productiv / Genesys.', category: 'Software', period: '2025–2026',
    subtitle: 'Team-built Rails productivity platform',
    description: 'Team-built Rails 8/PostgreSQL platform with personal and shared tasks, role-based areas, focus support, analytics and gamification.',
    role: 'Academic team project',
    roleDetail: 'Productiv was my Year 4 Genesys team project. The implementation described here is the team application; individual subsystem ownership is not established by the available records.',
    technologies: ['Ruby on Rails', 'PostgreSQL', 'RSpec', 'Stimulus'],
    metric: 'Full stack', metricLabel: 'Team product engineering',
    problem: 'Productiv is a Rails 8/PostgreSQL productivity application developed for the Year 4 Genesys team project. It combines personal and shared tasks, project membership, Pomodoro focus tools, notifications, points and analytics, with separate public, subscriber, reporter and admin areas.',
    approach: ['Role-based interface', 'Controllers', 'Domain services', 'PostgreSQL', 'Tests & CI'],
    decisions: [
      { title: 'Tasks, teams and shared services.', text: 'The team codebase separates services for tasks, teams, assignments, notifications and points from controllers and persistence.' },
      { title: 'Authentication and role-based access.', text: 'The platform contains subscriber, reporter, administrator and public workflows, with authentication and role-based authorisation.' },
      { title: 'Automated tests and CI.', text: 'The repository includes RSpec/Capybara tests, performance examples and CI definitions for test, security and lint stages. A complete passing run is not available in the retained records.' },
    ],
    results: [{ value: 'Tasks', label: 'Individual & shared work' }, { value: 'Focus', label: 'Pomodoro & gamification' }, { value: 'Insights', label: 'Role-based analytics' }],
    resultNote: 'These are capabilities of the team application. The repository includes RSpec/Capybara tests, performance examples and CI configuration for testing, security checks and linting.',
    limitations: 'The available records do not establish individual feature ownership or a complete passing test run. The illustration shows the application architecture, not its actual interface.',

    repo: 'https://github.com/Aio777/productiv',
  },
];
