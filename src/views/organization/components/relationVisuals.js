import logoPlaceholder from '@/assets/images/organization/service-provider-detail/logo-placeholder.png'
import personAvatarFemale from '@/assets/images/organization/service-provider-detail/person-avatar-female.png'
import personAvatarMale from '@/assets/images/organization/service-provider-detail/person-avatar-male.png'
import providerBuilding from '@/assets/images/organization/service-provider-detail/provider-building.png'
import projectFolder from '@/assets/images/organization/service-provider-detail/project-folder.png'
import hardwareServer from '@/assets/images/organization/service-provider-detail/hardware-server.png'
import hardwareTerminal from '@/assets/images/organization/service-provider-detail/hardware-terminal.png'
import softwareExternal from '@/assets/images/organization/service-provider-detail/software-external.png'
import softwareOffice from '@/assets/images/organization/service-provider-detail/software-office.png'
import softwareSupport from '@/assets/images/organization/service-provider-detail/software-support.png'

export const normalizeGender = (value) => {
  return String(value || '').trim().toLowerCase()
}

export const getStableFallbackAvatarVariant = (item = {}, index = 0) => {
  const candidate = [item.id, item.employeeNo, item.name, index]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .join('-')
  const total = Array.from(candidate).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return total % 2 === 0 ? 'male' : 'female'
}

export const resolvePersonAvatarVariant = (item = {}, index = 0) => {
  const gender = normalizeGender(item.gender)
  if (gender === '女' || gender === 'female' || gender === 'f') {
    return 'female'
  }
  if (gender === '男' || gender === 'male' || gender === 'm') {
    return 'male'
  }
  return getStableFallbackAvatarVariant(item, index)
}

export const resolvePersonAvatar = (item = {}, index = 0) => {
  return resolvePersonAvatarVariant(item, index) === 'female' ? personAvatarFemale : personAvatarMale
}

export const getSoftwareBadgeTone = (systemType) => {
  if (systemType === 'SUPPORT_SYSTEM' || systemType === 'BASIC_SUPPORT') {
    return 'green'
  }
  if (systemType === 'INTERNAL_OFFICE' || systemType === 'DATABASE_SOFTWARE') {
    return 'orange'
  }
  return 'blue'
}

export const getSoftwareIcon = (systemType) => {
  if (systemType === 'INTERNAL_OFFICE' || systemType === 'DATABASE_SOFTWARE') {
    return softwareOffice
  }
  if (systemType === 'EXTERNAL_SERVICE') {
    return softwareExternal
  }
  return softwareSupport
}

export const getSoftwareIconVariant = (systemType) => {
  if (systemType === 'INTERNAL_OFFICE' || systemType === 'DATABASE_SOFTWARE') {
    return 'software-office'
  }
  if (systemType === 'EXTERNAL_SERVICE') {
    return 'software-external'
  }
  return 'software-support'
}

export const getHardwareIcon = (hardwareCategory) => {
  return hardwareCategory === 'SERVER' ? hardwareServer : hardwareTerminal
}

export const getHardwareIconVariant = (hardwareCategory) => {
  return hardwareCategory === 'SERVER' ? 'hardware-server' : 'hardware-terminal'
}

export const getProjectIcon = () => projectFolder

export const getProjectIconVariant = () => 'project-folder'

export const getProviderIcon = (logoUrl) => logoUrl || providerBuilding || logoPlaceholder

export const getProviderIconVariant = (logoUrl) => (logoUrl ? '' : 'provider-building')
