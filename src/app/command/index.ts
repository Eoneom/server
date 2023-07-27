import {
  LoginCommand,
  LoginRequest,
  LoginResponse
} from '#app/command/login'
import {
  RefreshCommand, RefreshRequest
} from '#app/command/refresh'
import {
  ResearchTechnologyCommand, ResearchTechnologyRequest
} from '#app/command/research-technology'
import {
  SignupCommand,
  SignupRequest, SignupResponse
} from '#app/command/signup'
import {
  UpgradeBuildingCommand, UpgradeBuildingRequest
} from '#app/command/upgrade-building'

export class AppCommands {
  async signup(request: SignupRequest): Promise<SignupResponse> {
    const command = new SignupCommand()
    return command.run(request)
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const command = new LoginCommand()
    return command.run(request)
  }

  async upgradeBuilding(request: UpgradeBuildingRequest): Promise<void> {
    const command = new UpgradeBuildingCommand()
    return command.run(request)
  }

  async researchTechnology(request: ResearchTechnologyRequest): Promise<void> {
    const command = new ResearchTechnologyCommand()
    return command.run(request)
  }

  async refresh(request: RefreshRequest): Promise<void> {
    const command = new RefreshCommand()
    return command.run(request)
  }
}
