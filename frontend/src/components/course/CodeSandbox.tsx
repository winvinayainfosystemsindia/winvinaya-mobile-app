import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Divider
} from '@mui/material';
import { Send, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface CodingExercise {
  id: number;
  language: string;
  starter_code: string;
  instructions: string;
}

interface CodeSandboxProps {
  exercise: CodingExercise;
  onSubmit: (code: string) => Promise<any>;
}

const CodeSandbox: React.FC<CodeSandboxProps> = ({ exercise, onSubmit }) => {
  const [code, setCode] = useState(exercise.starter_code);
  const [output, setOutput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setCode(exercise.starter_code);
    setResult(null);
    setOutput('');
  }, [exercise]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await onSubmit(code);
      setResult(res);
      setOutput(res.output || '');
      setActiveTab(1); // Switch to output tab
    } catch (err) {
      console.error('Submission failed', err);
      setOutput('Error: Failed to submit code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(exercise.starter_code);
    setResult(null);
    setOutput('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1e1e1e' }}>
      {/* Editor & Instructions Area */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Instructions */}
        <Box sx={{ width: '30%', p: 2, color: '#fff', borderRight: '1px solid #333', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>Instructions</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, whiteSpace: 'pre-wrap' }}>
            {exercise.instructions}
          </Typography>
        </Box>

        {/* Monaco Editor */}
        <Box sx={{ width: '70%' }}>
          <Editor
            height="100%"
            language={exercise.language === 'python' ? 'python' : 'javascript'}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Box>
      </Box>

      {/* Footer / Console Area */}
      <Paper square sx={{ height: 200, bgcolor: '#000', color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, bgcolor: '#2d2d2d' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="inherit"
            indicatorColor="primary"
            sx={{ minHeight: 40 }}
          >
            <Tab label="Console" sx={{ minHeight: 40, fontSize: '0.75rem' }} />
            <Tab label="Results" sx={{ minHeight: 40, fontSize: '0.75rem' }} />
          </Tabs>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              size="small"
              color="inherit"
              startIcon={<RotateCcw size={14} />}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : <Send size={14} />}
              onClick={handleSubmit}
              disabled={submitting}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Divider sx={{ bgcolor: '#444' }} />
        <Box sx={{ p: 2, height: 160, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {activeTab === 0 ? (
            <Box>
              {output || 'No output yet. Click Submit to run your code.'}
            </Box>
          ) : (
            <Box>
              {result ? (
                <Alert
                  severity={result.status === 'accepted' ? "success" : "error"}
                  icon={result.status === 'accepted' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  sx={{ bgcolor: 'transparent', color: '#fff' }}
                >
                  <Typography variant="subtitle2">
                    {result.status === 'accepted' ? 'Success!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2">
                    Score: {result.score}% | Status: {result.status.replace('_', ' ')}
                  </Typography>
                </Alert>
              ) : (
                'Submit your code to see results against test cases.'
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CodeSandbox;
