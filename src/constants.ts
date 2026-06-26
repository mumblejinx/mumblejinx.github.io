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

export enum SupportSubsection {
  STORE = 'STORE',
  PORTAL = 'PORTAL',
  COMMISSIONS = 'COMMISSIONS',
}

export type Subsection = WorkSubsection | AboutSubsection | SupportSubsection | null;
