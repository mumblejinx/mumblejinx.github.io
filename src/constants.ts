export enum Section {
  INTRO = 'INTRO',
  WORK = 'WORK',
  ABOUT = 'ABOUT',
  SUPPORT = 'SUPPORT',
}

export enum WorkSubsection {
  ANALOG = 'ANALOG',
  DIGITAL = 'DIGITAL',
  PROJECTS = 'PROJECTS',
  STREET = 'STREET',
  MEANDER = 'MEANDER',
  SOURCE = 'SOURCE',
}

export enum AboutSubsection {
  WORD = 'WORD',
  RUNDOWN = 'RUNDOWN',
  CONTACT = 'CONTACT',
}

export type Subsection = WorkSubsection | AboutSubsection | null;
