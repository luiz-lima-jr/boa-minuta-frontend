import { SessionProfile } from "../models/session-profile.model";

export class AuthToken {
    
    sessionToken: string;
    refreshToken: string;
    sessionProfile: SessionProfile;

    public constructor(){

    }
}