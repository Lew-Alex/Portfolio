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
  tagline: 'Seeking a Winter 2026 internship.',
  location: 'City, State',
  email: 'alexlewandowski08@gmail.com',
  resumeUrl: '/resume.pdf',
  avatar: null, // put an image in src/assets and import it, or leave null for the initials avatar
  socials: [
    { label: 'GitHub', href: 'https://github.com/Lew-Alex', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-lewandowski/', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:alexlewandowski08@gmail.com', icon: 'mail' },
  ],
}

export const about = {
  paragraphs: [
    "I'm a student focused on robotics, including mechanical design, embedded electronics, and control systems. I like building things that move and solving hard hardware problems.",
    "Outside of robotics, I'm a skipper and sail a C420.",
  ],
}

export const experience = [
  {
    role: 'Head Programmer, Designer & Strategist',
    company: 'VEX Robotics Team 5225A, The PiLons',
    companyUrl: '',
    dates: 'Jun 2022 – Jun 2026',
    location: 'Oakville, ON',
    tags: ['C++', 'PID Control', 'Odometry', 'Fusion 360'],
    // Shown as the single bullet on the collapsed card.
    awardsSummary:
      'Design Award (2025 VEX Worlds) · Excellence Award (2025 Ontario Provincials) · Think Award (2024 & 2026 VEX Worlds)',
    // Shown on the collapsed card, under the awards summary — general role highlights.
    bullets: [
      'Built an odometry system fusing gyroscope, encoder wheel, and distance-sensor data to track robot position to ±0.02 m',
      'Designed closed-loop PID and feedforward velocity controllers to drive real-time autonomous motion algorithms',
      'Applied kinematics and inverse kinematics to control robotic arm positioning for precise game-element manipulation',
      'Developed state machines to coordinate subsystem behavior across autonomous and driver-controlled phases',
    ],
    seasons: [
      {
        label: '2023–2024 · Over Under',
        repoUrl: 'https://github.com/Lew-Alex/5225A-2023-2024',
        awards: [
          'Think Award — 2024 VEX Worlds',
          '8th of 20,000+ teams in Autonomous Skills at Worlds',
          'Design Award — 2025 Ontario Provincials',
        ],
        bullets: ['[Add what you worked on this season — e.g. a specific subsystem, feature, or redesign]'],
        media: [],
      },
      {
        label: '2024–2025 · High Stakes',
        repoUrl: 'https://github.com/Lew-Alex/5225A-2024-2025/tree/X-Drive',
        awards: [
          'Design Award — 2025 VEX Worlds',
          'Excellence Award — 2025 Ontario Provincials (First Place)',
          '4th of 20,000+ teams in Autonomous Skills at Worlds',
        ],
        bullets: ['[Add what you worked on this season — e.g. a specific subsystem, feature, or redesign]'],
        media: [
          { type: 'image', src: '/images/high-stakes-robot.png', caption: 'High Stakes Robot For 2025 Provincials' },
          { type: 'video', src: '/videos/high-stakes-1.mp4', caption: 'Autonomous Skills | 4th At Vex Worlds' },
        ],
      },
      {
        label: '2025–2026 · Push Back',
        awards: ['Think Award — 2026 VEX Worlds'],
        bullets: ['[Add what you worked on this season — e.g. a specific subsystem, feature, or redesign]'],
        media: [],
      },
    ],
  },
]

export const projects = [
  {
    title: 'WRO Robot',
    description: 'Autonomous robot built for the World Robot Olympiad.',
    details: [
      'Add a sentence on the challenge it solved and how it navigated/competed.',
      'Add another paragraph on the build process, biggest technical challenge, and the result.',
    ],
    highlights: [
      '[Add a spec — e.g. sensors used]',
      '[Add a spec — e.g. programming language/platform]',
      '[Add a result — e.g. competition placement]',
    ],
    image: null,
    media: [{ type: 'video', src: '/videos/wro-robot-1.mp4', caption: '' }],
    tags: ['Robotics', 'Autonomous Systems'],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
  {
    title: 'Differential Swerve Drive System',
    description: 'Custom swerve drive drivetrain using differential gearing for independent wheel steering and drive.',
    details: [
      'Add detail on the mechanical design and what it improved over a standard drivetrain.',
      'Add a paragraph on the CAD/manufacturing process and any testing/iteration.',
    ],
    highlights: [
      '[Add a spec — e.g. gear ratio]',
      '[Add a spec — e.g. CAD software used]',
      '[Add a result — e.g. performance improvement]',
    ],
    image: null,
    media: [],
    tags: ['CAD', 'Mechanical Design'],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
  {
    title: 'Robotic Hand',
    description: 'A robotic hand prototype.',
    details: [
      'Add detail on the actuation method (servos/tendons), degrees of freedom, and what it can grip or control.',
      'Add a paragraph on the design/print process and how it was controlled.',
    ],
    highlights: [
      '[Add a spec — e.g. number of fingers/DOF]',
      '[Add a spec — e.g. actuator type]',
      '[Add a result — e.g. what it can grip]',
    ],
    image: null,
    media: [],
    tags: ['Robotics', '3D Printing'],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
  {
    title: 'Sailing Electronic Compass',
    description: 'Electronic compass system built for sailing navigation.',
    details: [
      'Add detail on the sensors/electronics used and how it was calibrated.',
      'Add a paragraph on how it was mounted/used on the boat and what problem it solved.',
    ],
    highlights: [
      '[Add a spec — e.g. sensor/IC used]',
      '[Add a spec — e.g. microcontroller]',
      '[Add a result — e.g. accuracy achieved]',
    ],
    image: null,
    media: [],
    tags: ['Electronics', 'Embedded Systems'],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
]

export const skills = {
  Robotics: ['CAD (Onshape/Fusion 360)', '3D Printing', 'VEX Robotics', 'Sensors & Actuators'],
  Programming: ['C++', 'Python', 'JavaScript'],
  'Tools & Platforms': ['Git', 'Arduino'],
}
