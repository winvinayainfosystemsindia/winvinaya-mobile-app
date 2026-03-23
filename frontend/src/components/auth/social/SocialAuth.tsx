import React from 'react';
import { 
    Button, 
    Stack, 
    Typography, 
    Divider 
} from '@mui/material';
import {
    Google as GoogleIcon,
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon
} from '@mui/icons-material';

interface SocialAuthProps {
    onSocialLogin: (provider: string) => void;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ onSocialLogin }) => {
    return (
        <Stack spacing={2}>
            <Divider>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Continue with
                </Typography>
            </Divider>
            
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onSocialLogin('google')}
                    sx={{
                        borderColor: '#d1d7dc',
                        color: '#1c1d1f',
                        py: 1.5,
                        '&:hover': { borderColor: '#1c1d1f', bgcolor: 'rgba(28,29,31,0.04)' }
                    }}
                >
                    <GoogleIcon />
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onSocialLogin('linkedin')}
                    sx={{
                        borderColor: '#d1d7dc',
                        color: '#0A66C2',
                        py: 1.5,
                        '&:hover': { borderColor: '#1c1d1f', bgcolor: 'rgba(28,29,31,0.04)' }
                    }}
                >
                    <LinkedInIcon />
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onSocialLogin('github')}
                    sx={{
                        borderColor: '#d1d7dc',
                        color: '#1c1d1f',
                        py: 1.5,
                        '&:hover': { borderColor: '#1c1d1f', bgcolor: 'rgba(28,29,31,0.04)' }
                    }}
                >
                    <GitHubIcon />
                </Button>
            </Stack>
        </Stack>
    );
};

export default SocialAuth;
