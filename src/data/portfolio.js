// Edit this file with your real info — every component reads from here.
//
// Media items (project galleries, experience media) look like:
//   { type: 'image', src: '/path-or-import', caption: 'Optional caption' }
//   { type: 'video', src: '/path-or-import', caption: 'Optional caption' }
// Put files in src/assets, import them at the top of this file, and reference the import.
// Leave the array empty ([]) to show a placeholder until you add real media.

export const profile = {
  name: 'Alex Lewandowski',
  role: 'Incoming Mechatronics Student @ University of Waterloo',
  tagline: 'Seeking a Winter 2027 internship.',
  location: 'City, State',
  email: 'alexlewandowski08@gmail.com',
  resumeUrl: '/resume.pdf',
  avatar: '/images/avatar.jpg',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Lew-Alex', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-lewandowski/', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:alexlewandowski08@gmail.com', icon: 'mail' },
  ],
}

export const about = {
  paragraphs: [
    "I'm a student focused on robotics, including mechanical design, embedded electronics, and control systems. I like building things that move and solving hard hardware problems.",
    "Outside of robotics, I race competitively as a skipper on a C420, with top 3 regatta finishes and an 11th-place finish at the C420 International Cork Regatta.",
  ],
}

export const experience = [
  {
    role: 'Head Programmer, Designer & Strategist',
    company: 'VEX Robotics Team 5225A, The PiLons',
    companyUrl: '',
    dates: 'Jun 2022 – Jun 2026',
    location: 'Oakville, ON',
    // Shown as a thumbnail on the right of the collapsed card.
    image: '/images/high-stakes-robot.png',
    tags: ['C++', 'PID Control', 'Odometry', 'Fusion 360'],
    // Shown as the single bullet on the collapsed card.
    awardsSummary:
      'Design Award (2025 VEX Worlds) · Excellence Award (2025 Ontario Provincials) · Think Award (2024 & 2026 VEX Worlds)',
    // Shown on the collapsed card, under the awards summary — general role highlights.
    bullets: [
      'Built an odometry system fusing gyroscope, encoder wheel, and distance-sensor data to track robot position to ±0.02 m',
      'Designed closed-loop PID and feedforward velocity controllers to drive real-time autonomous motion algorithms',
      'Applied kinematics and inverse kinematics to control robotic arm positioning for precise game-element manipulation',
      'Developed state machines to coordinate subsystem behavior across autonomous and driver-controlled phases',
    ],
    seasons: [
      {
        slug: 'over-under',
        label: '2023–2024 · Over Under',
        repoUrl: 'https://github.com/Lew-Alex/5225A-2023-2024',
        awards: [
          'Think Award (2024 VEX Worlds)',
          '8th of 20,000+ teams in Autonomous Skills at Worlds',
          'Design Award (2025 Ontario Provincials)',
        ],
        bullets: [
          "Served as main programmer and a core mechanical designer, owning the robot's codebase and contributing to key chassis and subsystem design decisions.",
          'Designed closed-loop PID and feedforward velocity controllers, tuning gains to reduce settling time and overshoot during autonomous motion.',
          'Filtered noisy distance sensor readings to correct accumulated drift in the odometry system, improving position accuracy over longer autonomous runs.',
        ],
        media: [{ type: 'video', src: '/videos/over-under-1.mp4', caption: '' }],
      },
      {
        slug: 'push-back',
        label: '2025–2026 · Push Back',
        awards: ['Think Award (2026 VEX Worlds)', 'Innovate Award (2026 Ontario Provincials)'],
        bullets: [
          "Served as main programmer, owning the robot's codebase for autonomous and driver control.",
          'Designed closed-loop PID and feedforward velocity controllers, tuning gains to reduce settling time and overshoot during autonomous motion.',
          'Filtered noisy distance sensor readings to correct accumulated drift in the odometry system, improving position accuracy over longer autonomous runs.',
        ],
        media: [
          { type: 'video', src: '/videos/push-back-1.mp4', caption: '' },
          { type: 'video', src: '/videos/push-back-2.mp4', caption: '' },
        ],
      },
      {
        slug: 'high-stakes',
        label: '2024–2025 · High Stakes',
        repoUrl: 'https://github.com/Lew-Alex/5225A-2024-2025/tree/X-Drive',
        awards: [
          'Design Award (2025 VEX Worlds)',
          'Excellence Award (2025 Ontario Provincials, First Place)',
          '4th of 20,000+ teams in Autonomous Skills at Worlds',
        ],
        bullets: [
          "Served as head programmer, designer, and strategist for one of the team's most important seasons, leading the robot codebase, contributing to mechanical design decisions, and shaping match strategy.",
          'Implemented two-wheel odometry fused with distance sensor data for accurate robot localization.',
          'Designed velocity controllers and PID-based motion algorithms for the X-drive to maximize speed during autonomous movement.',
          'Ran the autonomous routine as a macro during driver skills runs, improving consistency over manual control.',
          'Built an SD card logging system for debugging, along with state machines to coordinate every subsystem on the robot.',
          "Served as a core mechanical designer and builder, helping develop the team's only Tier 3 hang built on an X-drive base that season.",
          'Engineered a power take-off (PTO) system that repurposed the X-drive motors to power the hanging mechanism, an approach no other X-drive team had implemented that season.',
        ],
        media: [
          { type: 'image', src: '/images/high-stakes-robot.png', caption: 'High Stakes Robot For 2025 Provincials' },
          { type: 'video', src: '/videos/high-stakes-1.mp4', caption: 'Autonomous Skills | 4th At Vex Worlds' },
          { type: 'video', src: '/videos/high-stakes-2.mp4', caption: 'Tier 3 Hang' },
        ],
      },
    ],
  },
]

export const projects = [
  {
    slug: 'wro-robot',
    title: 'WRO Robot',
    description: 'Autonomous robot built for the World Robot Olympiad.',
    details: [
      "Built for the World Robot Olympiad RoboMission challenge, this robot runs on an ESP32 and Teensy 4.1 working together, with the ESP32 handling sensor fusion and localization and the Teensy running motor control. A BNO085 nine axis IMU reads orientation over I2C, decoding rotation vector quaternions into a heading angle used for both driving and localization. Position tracking runs on a Monte Carlo particle filter, combining wheel odometry and IMU heading with two downward facing color sensors that read the floor against a pre mapped grayscale image of the competition field, correcting drift as the robot moves. A camera module was also integrated for vision based sensing of field elements.",
      "The field map and particle filter behavior were built and tested in Python before porting the logic to C++ on the ESP32. The chassis and mounting hardware were designed in CAD and 3D printed, keeping the electronics, motors, and sensors compact enough to meet the competition's size limits. Testing involved running the particle filter in simulation first, then validating it on hardware with real sensor noise, tuning the resampling and weighting steps until the estimated position matched the robot's actual path around the field.",
    ],
    highlights: [
      'Wrote a BNO085 IMU driver from scratch over I2C, parsing SHTP packets and decoding quaternion rotation vectors into a heading angle.',
      'Built a Monte Carlo particle filter for localization, fusing wheel odometry, IMU heading, and two color sensors reading the floor against a mapped field image.',
      'Prototyped the particle filter and field map in Python, visualizing particle convergence before porting the logic to C++ on the ESP32.',
      "Split the robot's compute between an ESP32 for sensing and localization and a Teensy 4.1 for motor control.",
      'Integrated a camera module for vision based detection of field elements.',
      "Designed and 3D printed the chassis in CAD to fit within the competition's size limit.",
    ],
    image: '/images/wro-robot-1.jpg',
    media: [
      { type: 'video', src: '/videos/wro-robot-1.mp4', caption: '' },
      { type: 'image', src: '/images/wro-robot-2.jpg', caption: '' },
      { type: 'image', src: '/images/wro-robot-3.jpg', caption: '' },
    ],
    tags: ['Robotics', 'Autonomous Systems', 'ESP32', 'Odometry & Motion Algorithms'],
    liveUrl: null,
    repoUrl: 'https://github.com/Lew-Alex/WRO-PiThons-2026',
    cadUrl: '/models/robot.glb',
    featured: true,
  },
  {
    slug: 'differential-swerve-drive',
    title: 'Differential Swerve Drive System',
    description: 'Custom swerve drive drivetrain using differential gearing for independent wheel steering and drive.',
    details: [
      'A custom differential swerve drivetrain built for VEX V5. Each wheel module uses two motors so it can drive and steer at the same time, with the difference in motor speed causing the wheel to swivel. Went through two design iterations, from a single working module to a full four wheel chassis.',
    ],
    highlights: [
      'Used two 84:64 ring gears and a pair of 40:20 bevel gears to build a planetary gear system for each module, so both motors work together to drive and steer the wheel.',
      'Built a custom thrust bearing out of ten 4.5mm steel balls held equidistant in a 3D printed bearing cage, since no standard bearing fit the size needed for the module.',
      'Calculated gear ratios in Fusion 360 to hit a 6.5 ft/s target speed. Tested with slow motion video and measured the finished module at about 6.2 ft/s, close to the goal.',
      'Ran gear skip and stall tests under load along with basic structural tests, which showed the C-channels bending since they were only supported at the top. Fixed this in the second iteration with 3D printed triangle braces.',
      'Added a VEX EDR quadrature encoder to each module for closed loop feedback, replacing the default open loop VEX code.',
      'Wrote a custom vector class to handle Cartesian and polar coordinates, rotation, and scaling, used to turn joystick input into a target speed and angle for each module.',
      'Tested heat set insert hole sizes and built a soldering iron adapter to install them properly before finalizing the gear and bearing designs.',
      'Finished the chassis with two swerve modules and two omni wheel casters, mounting the V5 brain, radio, and battery to make a complete four wheel robot.',
    ],
    image: '/images/swerve-2.jpg',
    media: [
      { type: 'video', src: '/videos/swerve-1.mp4', caption: '' },
      { type: 'video', src: '/videos/swerve-2.mp4', caption: '' },
      { type: 'image', src: '/images/swerve-1.jpg', caption: '' },
      { type: 'image', src: '/images/swerve-2.jpg', caption: '' },
      { type: 'image', src: '/images/swerve-3.jpg', caption: '' },
    ],
    tags: ['CAD', 'Mechanical Design', 'Mathematical Modeling', 'Control Algorithms'],
    liveUrl: null,
    repoUrl: 'https://github.com/Lew-Alex/Differential-Swerve-Drive/tree/main/src',
    featured: true,
  },
  {
    slug: 'robotic-hand',
    title: 'Robotic Hand',
    description: 'A robotic hand prototype.',
    details: [
      "This robotic hand grips a 250g+ spherical object using five actuating fingers, a rotating wrist, and an elbow, mimicking the dexterity of a human arm with no external wiring. Each finger uses a string push-pull mechanism driven by MG90S servos in the forearm, routed through full-length slits instead of holes to cut friction, with elastic tension pulling fingers back to a neutral position. The wrist rotates through a small drive gear turning a ring gear seated in a 45mm bearing, while two MG996R servos handle wrist flexion and elbow motion. Eleven servos in total were controlled from a Raspberry Pi Pico running bare-metal C against the Pico SDK, using structs and enums to mimic object-oriented behavior while manually configuring PWM slices and channels for each one. Iterated through several finger and forearm CAD revisions to fix string binding and print sag before finishing a fully assembled hand, wrist, and forearm.",
    ],
    highlights: [
      'Designed a string push-pull finger mechanism with full-length slits instead of circular holes, eliminating the excess friction that stalled earlier prototypes and letting the string self-align during motion.',
      'Used elastic tension to return each finger to a neutral position, removing the need for a second dedicated actuator per finger.',
      'Added a vertical joint to each finger by pulling its two control strings asymmetrically, giving fingers a horizontal tilt in addition to curling.',
      'Geared wrist rotation through a small drive gear turning a ring gear mounted on a 45mm bearing, keeping rotation within a ±45° range while routing string through a printed string router to avoid tangling.',
      'Programmed all 11 servos on a Raspberry Pi Pico in bare-metal C using the Pico SDK, manually configuring PWM slices and channels and using structs and enums in place of classes.',
      'Diagnosed a current-limited power delivery issue where actuating more than 4 fingers at once caused servos to stall, tracing it to thin breadboard wiring.',
      'Fixed print-sag-induced tolerance loss in the forearm with a custom printed gasket to restore clamping force after long prints deformed the housing.',
      'Iterated finger and hand CAD through a decision matrix scoring each concept on ease of construction, functionality, efficiency, and reliability before settling on the final design.',
    ],
    image: '/images/robotic-hand-1.jpg',
    media: [
      { type: 'image', src: '/images/robotic-hand-1.jpg', caption: '' },
      { type: 'image', src: '/images/robotic-hand-2.jpg', caption: '' },
    ],
    tags: ['Robotics', '3D Printing'],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
  {
    slug: 'sailing-compass',
    title: 'Sailing Electronic Compass',
    description: 'Electronic compass system built for sailing navigation.',
    details: [],
    highlights: [],
    image: '/images/compass-2.jpg',
    media: [
      { type: 'video', src: '/videos/compass-1.mp4', caption: '' },
      { type: 'video', src: '/videos/compass-2.mp4', caption: '' },
    ],
    tags: ['Electronics', 'Embedded Systems'],
    liveUrl: null,
    repoUrl: 'https://github.com/Lew-Alex/sailing_compass',
    featured: true,
  },
]

export const skills = {
  Robotics: ['CAD (Onshape/Fusion 360)', '3D Printing', 'VEX Robotics', 'Sensors & Actuators'],
  Programming: ['C++', 'Python', 'JavaScript'],
  'Tools & Platforms': ['Git', 'Arduino'],
}
