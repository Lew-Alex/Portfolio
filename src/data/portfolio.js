// Every component reads from this file. Text in here is the site's copy:
// components only decide how it is laid out.
//
// Media item shape (carousels, galleries, blocks):
//   { type: 'image' | 'video', src: '/path', caption: 'Optional caption' }
//
// Detail-page sections are composed from typed blocks, rendered in order:
//   { type: 'prose',      title, paragraphs: [String] }
//   { type: 'spec-grid',  title, intro?, specs: [{ label, value }] }
//   { type: 'figure-grid', title, intro?, images: [{ src, caption }] }
//   { type: 'video',      title, video: { src, caption } }
//   { type: 'stats',      title, intro?, stats: [{ value, label, note? }] }
//   { type: 'gallery',    title, items: [{ type: 'image'|'video', src, caption }] }
//   { type: 'callout',    title, text }
//
// TODO(Alex): items marked TODO are the ones only you can fill in.

import {
  wroPhotos,
  wroCad,
  wroVideos,
  highStakesCad,
  highStakesVideos,
  overUnderPhotos,
  overUnderVideos,
  pushBackPhotos,
  pushBackCad,
  pushBackVideos,
} from './media'

/* ---------------------------------------------------------------------------
   Photo captions
   The photo lists in media.js are generated from the image folder, so captions
   belong here, keyed by filename. Anything without a line simply shows its
   index number in the gallery.
   --------------------------------------------------------------------------- */
function withCaptions(items, captions = {}) {
  return items.map((item) => ({
    ...item,
    caption: captions[item.src.split('/').pop()] || item.caption || '',
  }))
}

// TODO(Alex): one line per photo, keyed by filename.
const highStakesCadCaptions = {
  // 'hs-cad-01.jpg': 'X-drive module',
}

export const profile = {
  name: 'Alex Lewandowski',
  // Hero eyebrow: location · availability
  location: 'Ontario, Canada', // TODO(Alex): narrow to your city if you want
  availability: 'Available for Winter 2027 internships',
  role: 'Mechatronics Engineering @ University of Waterloo',
  // One line under the name: what you are, not what you want
  headline: 'Robotics · Embedded systems · Mechanical design',
  tagline: 'Seeking a Winter 2027 internship.',
  email: 'alexlewandowski08@gmail.com',
  resumeUrl: '/resume.pdf',
  avatar: '/images/avatar.jpg',
  // Portrait beside the name in the opening block.
  portrait: '/images/avatar.jpg',
  portraitCaption: '',

  // Hero photograph: off by default so the page opens on the type. Point this
  // at any wide image in public/ (e.g. '/images/high-stakes/hs-03.jpg') and a
  // captioned photo appears between the intro and the spec rows.
  heroImage: null,
  heroCaption: '',

  // Intro paragraphs, shown beside the hero buttons. Empty for now: the page
  // opens on the name, the role line and the buttons.
  intro: [],

  // Hero spec rows. Delete a row (or leave it empty) and it disappears.
  focus: 'Robotics · Embedded systems · Mechanical design',
  tools: 'Fusion 360 · VEX V5 · ESP32 / Teensy · Raspberry Pi Pico · 3D printing',
  now: null, // TODO(Alex): what are you building right now? e.g. 'Building a custom robot vacuum'

  socials: [
    { label: 'GitHub', href: 'https://github.com/Lew-Alex', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-lewandowski/', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:alexlewandowski08@gmail.com', icon: 'mail' },
  ],
}

// Contact section copy. Everything here is optional: with all three null the
// section runs heading → email → links and nothing else.
export const contact = {
  title: 'Get in touch',
  lead: null,
  statement: null,
}

export const about = {
  title: 'About',
  lead: null,
  // Soft backdrop behind the About section. Set to null to remove it.
  bgImage: '/images/about-bg.jpg',
  paragraphs: [
    "I'm a student focused on robotics, including mechanical design, embedded electronics, and control systems. I like building things that move and solving hard hardware problems.",
    'Most of that has happened on VEX Robotics Team 5225A, where I went from builder to head programmer and designer across four seasons, writing the autonomous routines, designing the mechanisms they ran on, and iterating through the failures in between.',
    'Outside of robotics, I race competitively as a skipper on a C420, with top 3 regatta finishes and an 11th-place finish at the C420 International Cork Regatta.',
  ],
}

// Skills: grouped the way a hiring reviewer scans them. TODO(Alex): trim or
// add as your experience changes; keep the groups to three or four.
export const skills = {
  Mechanical: [
    'CAD (Fusion 360, Onshape)',
    '3D printing / FDM tolerances',
    'Gear trains & mechanisms',
    'Design iteration & testing',
  ],
  Embedded: ['ESP32', 'Teensy 4.1', 'Raspberry Pi Pico (bare-metal C)', 'VEX V5', 'I2C & custom serial links'],
  Software: ['C++', 'Python', 'JavaScript', 'PID & feedforward control', 'State machines', 'Odometry / sensor fusion'],
}

export const experience = [
  {
    role: 'Head Programmer, Designer & Strategist',
    company: 'VEX Robotics Team 5225A, The PiLons',
    companyUrl: '',
    dates: 'Jun 2022 – Jun 2026',
    location: 'Oakville, ON',
    image: '/images/high-stakes-robot.png',
    tags: ['C++', 'PID Control', 'Odometry', 'Fusion 360'],
    awardsSummary:
      'Design Award (2025 VEX Worlds) · Excellence Award (2025 Ontario Provincials) · Think Award (2024 & 2026 VEX Worlds)',
    bullets: [
      'Built an odometry system fusing gyroscope, encoder wheel, and distance-sensor data to track robot position to ±0.02 m',
      'Designed closed-loop PID and feedforward velocity controllers to drive real-time autonomous motion algorithms',
      'Applied kinematics and inverse kinematics to control robotic arm positioning for precise game-element manipulation',
      'Developed state machines to coordinate subsystem behavior across autonomous and driver-controlled phases',
    ],
    seasons: [
      {
        slug: 'over-under',
        label: '2023–2024 · Over Under',
        year: '2023–2024',
        description: 'Main programmer and mechanical designer on our Worlds-qualifying entry.',
        image: '/images/over-under-robot.jpg',
        // Main image in the hero band: 7th photo in the season's gallery.
        heroImage: '/images/over-under/ou-07.jpg',
        repoUrl: 'https://github.com/Lew-Alex/5225A-2023-2024',
        tags: ['C++', 'PID Control', 'Odometry'],
        awards: [
          'Think Award (2024 VEX Worlds)',
          '8th of 10,000+ teams in Autonomous Skills at Worlds',
          'Design Award (2024 Ontario Provincials)',
        ],
        // Season pages use the same block types as projects. Section 1 is always
        // the overview, and it runs the full column width.
        sections: [
          {
            type: 'prose',
            title: 'Overview',
            items: [
              "Served as main programmer and a core mechanical designer, owning the robot's codebase and contributing to key chassis and subsystem design decisions.",
              'Designed closed-loop PID and feedforward velocity controllers, tuning gains to reduce settling time and overshoot during autonomous motion.',
              'Filtered noisy distance sensor readings to correct accumulated drift in the odometry system, improving position accuracy over longer autonomous runs.',
            ],
          },
          {
            type: 'gallery',
            title: 'Photos',
            items: overUnderPhotos,
          },
          {
            type: 'gallery',
            title: 'Video',
            items: [
              { type: 'video', src: '/videos/over-under-1.mp4', caption: 'Driving and scoring on a mobile goal' },
              ...overUnderVideos,
            ],
          },
        ],
      },
      {
        slug: 'high-stakes',
        label: '2024–2025 · High Stakes',
        year: '2024–2025',
        description: 'Head programmer, designer, and strategist for our most decorated season.',
        // Standout season: renders a star in the experience list, puts the
        // season first there, and shows the star on the season page.
        // `bestLabel` is the hover/accessible text, not visible wording.
        best: true,
        bestLabel: 'Standout season',
        image: '/images/high-stakes-robot.png',
        repoUrl: 'https://github.com/Lew-Alex/5225A-2024-2025/tree/X-Drive',
        tags: ['C++', 'X-Drive', 'PTO', 'Odometry'],
        awards: [
          'Design Award (2025 VEX Worlds)',
          'Excellence Award (2025 Ontario Provincials, First Place)',
          '4th of 10,000+ teams in Autonomous Skills at Worlds',
        ],
        sections: [
          {
            type: 'prose',
            title: 'Overview',
            paragraphs: [
              "As head programmer, designer and strategist I owned the robot's codebase, but the work that mattered most happened between the CAD and the field: deciding which mechanisms were worth the weight, and which ones would break under a Worlds schedule.",
              'The robot hung four feet in the air as an endgame, on a base almost nobody else hung with: an X-drive with a power take-off that reused the drive motors to lift the robot.',
            ],
            items: [
              "Served as head programmer, designer, and strategist for one of the team's most important seasons, leading the robot codebase, contributing to mechanical design decisions, and shaping match strategy.",
              'Implemented two-wheel odometry fused with distance sensor data for accurate robot localization.',
              'Designed velocity controllers and PID-based motion algorithms for the X-drive to maximize speed during autonomous movement.',
              'Ran the autonomous routine as a macro during driver skills runs, improving consistency over manual control.',
              'Built an SD card logging system for debugging, along with state machines to coordinate every subsystem on the robot.',
              "Served as a core mechanical designer and builder, helping develop the team's only Tier 3 hang built on an X-drive base that season.",
              'Engineered a power take-off (PTO) system that repurposed the X-drive motors to power the hanging mechanism, an approach no other X-drive team had implemented that season.',
            ],
          },
          {
            // TODO(Alex): draft copy in both columns, written to be replaced.
            type: 'columns',
            title: 'Robot highlights',
            columns: [
              {
                title: 'Tier 3 hang',
                text: 'The robot hung from the Tier 3 bar at roughly four feet, on an X-drive base that no other team hung with that season.',
                contribution:
                  'I helped design and build the hang mechanism, and engineered the power take-off that drove it: the X-drive motors were repurposed to lift the robot instead of spinning the wheels.',
                videos: [
                  { type: 'video', src: '/videos/high-stakes-2.mp4', caption: 'Tier 3 hang' },
                  ...highStakesVideos,
                ],
              },
              {
                title: 'Autonomous Skills',
                text: 'Autonomous Skills is scored on the autonomous period alone. The team finished 4th of 10,000+ teams at Worlds.',
                contribution:
                  'I wrote the autonomous routines: two-wheel odometry fused with distance sensor data, PID velocity control for the X-drive, and a macro that replayed the routine during driver skills runs.',
                videos: [
                  {
                    type: 'video',
                    src: '/videos/high-stakes-1.mp4',
                    caption: 'Autonomous Skills: 4th at VEX Worlds',
                  },
                ],
              },
            ],
          },
          {
            type: 'gallery',
            title: 'CAD',
            intro: 'Screenshots of the X-drive and hang assembly.',
            items: withCaptions(highStakesCad, highStakesCadCaptions),
          },
          {
            // TODO(Alex): placeholder build log. Dates and captions are stand-ins
            // written to be replaced. Each group is { when, items: [{ src,
            // caption }] }; add, delete or reorder groups and images freely.
            type: 'timeline',
            title: 'Build progression',
            intro: 'How the robot changed from the first sketch to the last match.',
            groups: [
              {
                when: 'Sep 2024',
                items: [
                  { type: 'video', src: '/videos/high-stakes-6.mp4', caption: 'First video of robot intaking.' },
                  { type: 'video', src: '/videos/high-stakes-5.mp4', caption: 'First autonomous routine.' },
                ],
              },
              {
                when: 'Oct 2024',
                items: [
                  { type: 'video', src: '/videos/high-stakes-7.mp4', caption: 'Mobile Goal Aligner' },
                  { type: 'video', src: '/videos/high-stakes-8.mp4', caption: 'Autonomous Progress' },
                  { src: '/images/high-stakes/hs-19.jpg', caption: 'Lift designing + build' },
                ],
              },
              {
                when: 'Nov 2024',
                items: [
                  { type: 'video', src: '/videos/high-stakes-10.mp4', w: 1152, h: 648, caption: 'Full Autonomous Routine' },
                  // Replaced the earlier second clip with IMG_7305.MOV (16s, 1080p).
                  // Kept the caption that was on that slot; change it if it no longer fits.
                  { type: 'video', src: '/videos/high-stakes-12.mp4', w: 1152, h: 648, caption: 'Part of Autonomous Skills' },
                ],
              },
              {
                when: 'Dec 2024',
                note: 'Competition on December 14th',
                items: [
                  { type: 'video', src: '/videos/high-stakes-13.mp4', w: 1152, h: 648, caption: '62 Point skills (World Record at the time)' },
                ],
              },
              {
                when: 'Jan 2025',
                items: [
                  { src: '/images/high-stakes/hs-20.jpg', caption: 'Start of rebuild' },
                ],
              },
              {
                when: 'Feb 2025',
                items: [
                  { type: 'video', src: '/videos/high-stakes-14.mp4', w: 1080, h: 1920, caption: 'Tier 3 High Hang Winch PTO Design' },
                  { src: '/images/high-stakes/hs-21.jpg', caption: 'Getting ready for provincials' },
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'push-back',
        label: '2025–2026 · Push Back',
        year: '2025–2026',
        description: "Head programmer, owning the robot's codebase for autonomous and driver control.",
        image: '/images/push-back/pb-10.jpg',
        // Big image at the top of the season page (falls back to `image` if omitted)
        heroImage: '/images/push-back/pb-10.jpg',
        repoUrl: '',
        tags: ['C++', 'PID Control', 'Odometry'],
        awards: [
          'Think Award (2026 VEX Worlds)',
          'Innovate Award (2026 Ontario Provincials)',
          '12th of 10,000+ teams in Skills',
        ],
        sections: [
          {
            type: 'prose',
            title: 'Overview',
            items: [
              "Served as main programmer, owning the robot's codebase for autonomous and driver control.",
              'Designed closed-loop PID and feedforward velocity controllers, tuning gains to reduce settling time and overshoot during autonomous motion.',
              'Filtered noisy distance sensor readings to correct accumulated drift in the odometry system, improving position accuracy over longer autonomous runs.',
            ],
          },
          {
            type: 'gallery',
            title: 'Photos',
            items: [
              ...pushBackPhotos,
              // Moved here from the High Stakes page: the photo is from Push Back.
              { type: 'image', src: '/images/push-back-robot.jpg', caption: 'Workbench between matches' },
            ],
          },
          {
            type: 'gallery',
            title: 'CAD',
            items: pushBackCad,
          },
          {
            type: 'gallery',
            title: 'Video',
            items: [
              { type: 'video', src: '/videos/push-back-2.mp4' },
              ...pushBackVideos,
            ],
          },
        ],
      },
    ],
  },
]

export const projects = [
  {
    slug: 'wro-robot',
    title: 'WRO Robot',
    year: '2025–2026',
    status: 'Completed',
    category: 'Competitive Robotics',
    role: 'Mechanical design · Embedded programming · Localization',
    description: 'Autonomous robot built for the World Robot Olympiad.',
    // TODO(Alex): this captioned the photograph it used to show ("The RoboMission
    // robot: ESP32 and Teensy 4.1 split between localization and sensing."), which
    // does not describe a CAD view, so it is hidden. Add a line for the render.
    heroCaption: '',
    details: [
      "Built for the World Robot Olympiad RoboMission challenge, this robot runs on an ESP32 and Teensy 4.1 working together, with the ESP32 handling sensor fusion, localization, and motor control, while a dedicated Teensy 4.1 reads a BNO085 nine axis IMU over I2C and relays a continuous heading angle to the ESP32 over a custom serial link. Position tracking runs on a Monte Carlo particle filter, combining wheel odometry and IMU heading with two downward facing color sensors that read the floor against a pre mapped grayscale image of the competition field, correcting drift as the robot moves. A camera module was also integrated for vision based sensing of field elements.",
      "The field map and particle filter behavior were built and tested in Python before porting the logic to C++ on the ESP32. The chassis and mounting hardware were designed in CAD and 3D printed, keeping the electronics, motors, and sensors compact enough to meet the competition's size limits. Testing involved running the particle filter in simulation first, then validating it on hardware with real sensor noise, tuning the resampling and weighting steps until the estimated position matched the robot's actual path around the field.",
    ],
    highlights: [
      'Used the Adafruit BNO08x library to read orientation over I2C, converting quaternion rotation vectors into a continuous heading angle and relaying it over a custom COBS-framed serial link between the Teensy and ESP32.',
      'Built a Monte Carlo particle filter for localization, fusing wheel odometry, IMU heading, and two color sensors reading the floor against a mapped field image.',
      'Prototyped the particle filter and field map in Python, visualizing particle convergence before porting the logic to C++ on the ESP32.',
      "Split the robot's compute between an ESP32 running sensor fusion, localization, and motor control, and a Teensy 4.1 dedicated to reading the IMU and relaying heading over serial.",
      'Integrated a camera module for vision based detection of field elements.',
      "Designed and 3D printed the chassis in CAD to fit within the competition's size limit.",
    ],
    image: '/images/wro-robot-1.jpg',
    // Main image in the hero band: the second CAD view.
    heroImage: '/images/wro/cad/wro-cad-02.jpg',
    media: [
      { type: 'video', src: '/videos/wro-robot-1.mp4', caption: 'Navigating the RoboMission course' },
      { type: 'image', src: '/images/wro-robot-2.jpg', caption: 'Early build, wired up' },
      { type: 'image', src: '/images/wro-robot-3.jpg', caption: 'Pneumatics and control board' },
    ],
    tags: ['Robotics', 'Autonomous Systems', 'ESP32', 'Odometry & Motion Algorithms'],
    technologies: [
      'ESP32',
      'Teensy 4.1',
      'BNO085 IMU',
      'Camera-based object detection',
      'Monte Carlo particle filter',
      'I2C',
      'COBS serial framing',
      'Autodesk Fusion 360',
      'C++',
      'Python',
    ],
    liveUrl: null,
    repoUrl: 'https://github.com/Lew-Alex/WRO-PiThons-2026',
    // 3D model viewer: off for now. The model moved out of public/ so a 34 MB
    // file stops shipping in the deploy. To bring it back:
    //   mv ~/Documents/Github/portfolio-assets-offline/robot.glb public/models/
    //   then set cadUrl: '/models/robot.glb'
    cadUrl: null,
    featured: true,
    meta: {
      timeline: '2025–2026',
      status: 'Completed',
      team: 'PiThons',
      role: ['Mechanical design', 'Embedded programming (ESP32 / Teensy 4.1)', 'Localization & sensor fusion'],
    },
    recognition: [
      {
        year: '2026',
        title: 'Qualified: California Invitational Open',
        context: 'World Robot Olympiad, after Nationals',
        note: 'The only robot in the field to use pneumatics and custom-designed electronics.',
      },
    ],
    sections: [
      {
        type: 'prose',
        title: 'Overview',
        paragraphs: [
          'Built for the World Robot Olympiad RoboMission challenge, this robot runs on an ESP32 and Teensy 4.1 working together, with the ESP32 handling sensor fusion, localization, and motor control, while a dedicated Teensy 4.1 reads a BNO085 nine axis IMU over I2C and relays a continuous heading angle to the ESP32 over a custom serial link.',
          'The field map and particle filter behavior were built and tested in Python before porting the logic to C++ on the ESP32, then validated on hardware with real sensor noise until the estimated position matched the robot’s actual path around the field.',
        ],
      },
      {
        type: 'spec-grid',
        title: 'Electronics',
        intro: 'Off-the-shelf parts, custom integration.',
        specs: [
          { label: 'Microcontrollers', value: 'ESP32 + Teensy 4.1' },
          { label: 'Inertial sensing', value: 'BNO085 IMU (I2C)' },
          { label: 'Vision', value: 'Camera-based object detection' },
          { label: 'Localization', value: 'Monte Carlo particle filter' },
          { label: 'Floor sensing', value: 'Two downward-facing color sensors' },
          { label: 'Chassis', value: 'CAD-designed, 3D printed' },
        ],
      },
      {
        type: 'prose',
        title: 'How it works',
        paragraphs: [
          'Position tracking runs on a Monte Carlo particle filter, combining wheel odometry and IMU heading with two downward facing color sensors that read the floor against a pre-mapped grayscale image of the field, correcting drift as the robot moves.',
        ],
      },
      {
        type: 'figure-grid',
        title: 'Build',
        images: [
          { src: '/images/wro-robot-2.jpg', caption: 'Early build, wired up' },
          { src: '/images/wro-robot-3.jpg', caption: 'Pneumatics and control board' },
        ],
      },
      {
        type: 'callout',
        title: 'Software',
        text: 'The particle filter and field map were prototyped in Python (visualizing particle convergence frame by frame) before the same logic was ported to C++ on the ESP32.',
      },
      {
        type: 'gallery',
        title: 'CAD',
        intro: 'Screenshots of the assembly as designed.',
        items: wroCad,
      },
      {
        // One section, two carousels: photos on the left, video on the right.
        // Equal-width columns plus a shared frame ratio means the two frames
        // come out exactly the same height.
        type: 'media-split',
        title: 'Photos and video',
        leftTitle: 'Photos',
        photos: wroPhotos,
        rightTitle: 'Video',
        videos: wroVideos,
      },
    ],
  },
  {
    slug: 'differential-swerve-drive',
    title: 'Differential Swerve Drive System',
    year: '2025',
    status: 'Completed',
    category: 'Mechanical Design',
    role: 'Design · Gear train analysis · Control software',
    description: 'Custom swerve drive drivetrain using differential gearing for independent wheel steering and drive.',
    heroCaption: 'A single differential swerve module: two motors driving and steering through one planetary train.',
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
    heroImage: '/images/swerve-2.jpg',
    media: [
      { type: 'video', src: '/videos/swerve-1.mp4', caption: 'Module testing' },
      { type: 'video', src: '/videos/swerve-2.mp4', caption: 'Full chassis driving' },
      { type: 'image', src: '/images/swerve-1.jpg', caption: '' },
      { type: 'image', src: '/images/swerve-2.jpg', caption: '' },
      { type: 'image', src: '/images/swerve-3.jpg', caption: '' },
    ],
    tags: ['CAD', 'Mechanical Design', 'Mathematical Modeling', 'Control Algorithms'],
    technologies: [
      'Autodesk Fusion 360',
      'VEX V5',
      'Planetary gear trains',
      'Custom thrust bearing',
      'VEX EDR quadrature encoders',
      'Closed-loop control',
      '3D printing',
      'C++',
    ],
    liveUrl: null,
    repoUrl: 'https://github.com/Lew-Alex/Differential-Swerve-Drive/tree/main/src',
    featured: true,
    meta: {
      timeline: '2025',
      status: 'Completed',
      role: ['Gear train design & analysis', 'CAD / 3D printing', 'Testing (stall, gear skip, speed)', 'Control software'],
    },
    sections: [
      {
        type: 'prose',
        title: 'Overview',
        paragraphs: [
          'A custom differential swerve drivetrain built for VEX V5. Each wheel module uses two motors so it can drive and steer at the same time, with the difference in motor speed causing the wheel to swivel.',
          'It went through two design iterations, from a single working module to a full four-wheel chassis, and most of the second iteration came from what the first one broke.',
        ],
      },
      {
        type: 'spec-grid',
        title: 'Design',
        intro: 'Everything below the shaft was designed and printed from scratch.',
        specs: [
          { label: 'Gear train', value: '2 × 84:64 ring gears + 40:20 bevel pair per module' },
          { label: 'Thrust bearing', value: 'Custom: ten 4.5 mm steel balls in a printed cage' },
          { label: 'Feedback', value: 'VEX EDR quadrature encoder per module' },
          { label: 'Chassis', value: '2 swerve modules + 2 omni casters' },
          { label: 'Target speed', value: '6.5 ft/s (measured ≈6.2 ft/s)' },
        ],
      },
      {
        type: 'prose',
        title: 'Testing & failures',
        paragraphs: [
          'Gear skip and stall tests under load showed the C-channels bending, since they were only supported at the top. The second iteration fixed that with 3D printed triangle braces, and the same test cycle pushed the module to its measured speed.',
          'Heat set inserts were the other quiet failure mode: hole sizes were tested and a soldering iron adapter built before the gear and bearing designs were finalized.',
        ],
      },
      {
        type: 'gallery',
        title: 'Gallery',
        // w/h are the sizes the browser displays (EXIF rotation applied), so the
        // columns reserve the right box before each file loads.
        items: [
          { type: 'video', src: '/videos/swerve-1.mp4', w: 1080, h: 1920, caption: 'Module testing' },
          { type: 'video', src: '/videos/swerve-2.mp4', w: 1080, h: 1920, caption: 'Full chassis driving' },
          { type: 'image', src: '/images/swerve-1.jpg', w: 3024, h: 4032, caption: 'Module, gear train' },
          { type: 'image', src: '/images/swerve-2.jpg', w: 4032, h: 3024, caption: 'Assembled module' },
          { type: 'image', src: '/images/swerve-3.jpg', w: 4284, h: 5712, caption: 'Chassis' },
        ],
      },
    ],
  },
  {
    slug: 'robotic-hand',
    title: 'Robotic Hand',
    year: '2024',
    status: 'Completed',
    category: 'Robotics',
    role: 'Design · Fabrication · Firmware',
    description: 'A five-fingered robotic hand with a rotating wrist and elbow, driven entirely from the forearm.',
    heroCaption: 'Eleven servos, no external wiring. The hand, wrist and forearm as a single assembly.',
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
    heroImage: '/images/robotic-hand-1.jpg',
    media: [
      { type: 'image', src: '/images/robotic-hand-1.jpg', caption: '' },
      { type: 'image', src: '/images/robotic-hand-2.jpg', caption: '' },
    ],
    tags: ['Robotics', '3D Printing', 'Embedded'],
    technologies: [
      'Raspberry Pi Pico (bare-metal C)',
      'Pico SDK',
      'MG90S / MG996R servos',
      'PWM',
      'String push-pull actuation',
      'Autodesk Fusion 360',
      '3D printing',
    ],
    liveUrl: null,
    repoUrl: null,
    featured: true,
    meta: {
      timeline: '2024',
      status: 'Completed',
      role: ['Mechanical design', 'Fabrication & assembly', 'Firmware (bare-metal C)'],
    },
    sections: [
      {
        type: 'prose',
        title: 'Overview',
        paragraphs: [
          'A robotic hand that grips a 250 g+ spherical object using five actuating fingers, a rotating wrist and an elbow, mimicking the dexterity of a human arm with no external wiring.',
          'Each finger is driven by a string push-pull mechanism from MG90S servos in the forearm, with elastic tension returning fingers to neutral. The wrist rotates through a drive gear turning a ring gear seated in a 45 mm bearing, and two MG996R servos handle wrist flexion and elbow motion.',
        ],
      },
      {
        type: 'prose',
        title: 'Firmware',
        paragraphs: [
          'Eleven servos run from a Raspberry Pi Pico in bare-metal C against the Pico SDK: PWM slices and channels configured by hand, with structs and enums standing in for classes.',
        ],
      },
      {
        type: 'callout',
        title: 'Diagnosed under load',
        text: 'Actuating more than four fingers at once stalled the servos. The cause was current-limited power delivery through thin breadboard wiring, not the servo sizing. Found by measuring rather than guessing.',
      },
      {
        type: 'figure-grid',
        title: 'Build',
        images: [
          { src: '/images/robotic-hand-1.jpg', caption: 'Assembled hand, wrist and forearm' },
          { src: '/images/robotic-hand-2.jpg', caption: 'Finger mechanism and string routing' },
        ],
      },
    ],
  },
  {
    slug: 'sailing-compass',
    title: 'Sailing Electronic Compass',
    year: '2024',
    status: 'Completed',
    category: 'Electronics',
    role: 'Electronics · Embedded',
    description: 'Electronic compass system built for sailing navigation.',
    heroCaption: '', // TODO(Alex): one line describing what is in the photo
    details: [], // TODO(Alex): 2–3 paragraphs on what it does and how it works
    highlights: [], // TODO(Alex): the interesting engineering decisions
    image: '/images/compass-2.jpg',
    heroImage: '/images/compass-1.jpg',
    media: [
      { type: 'video', src: '/videos/compass-1.mp4', caption: '' },
      { type: 'video', src: '/videos/compass-2.mp4', caption: '' },
    ],
    tags: ['Electronics', 'Embedded Systems'],
    technologies: [], // TODO(Alex): board, sensor, language
    liveUrl: null,
    repoUrl: 'https://github.com/Lew-Alex/sailing_compass',
    featured: true,
    meta: {
      timeline: '2024',
      status: 'Completed',
      role: [], // TODO(Alex)
    },
    // TODO(Alex): give this project the same depth as the others, e.g.
    // sections: [
    //   { type: 'prose', title: 'Overview', paragraphs: ['…'] },
    //   { type: 'spec-grid', title: 'Hardware', specs: [{ label: 'MCU', value: '…' }] },
    //   { type: 'stats', title: 'Results', stats: [{ value: '…', label: '…' }] },
    //   { type: 'gallery', title: 'Gallery', items: [{ type: 'image', src: '/images/compass-2.jpg', caption: '…' }] },
    // ],
    // TODO(Alex): draft copy in the Source section - replace with your wording.
    // The rest of the depth is still open (see the commented-out outline below).
    sections: [
      {
        type: 'prose',
        title: 'Source',
        paragraphs: [
          'Firmware, board files and the calibration notes live in the project folder on GitHub.',
          'Built as a standalone electronics project: a magnetometer with tilt compensation, driving a heading readout for use on the water.',
        ],
        links: [
          { label: 'github.com/Lew-Alex/sailing_compass', href: 'https://github.com/Lew-Alex/sailing_compass' },
          { label: 'github.com/Lew-Alex', href: 'https://github.com/Lew-Alex' },
        ],
      },
    ],
  },
]
