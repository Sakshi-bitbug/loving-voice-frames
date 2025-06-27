
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Mic, MicOff, Play, Square } from 'lucide-react';
import { Memory } from './MemoryCard';

interface AddMemoryFormProps {
  onAddMemory: (memory: Omit<Memory, 'id'>) => void;
  onCancel: () => void;
}

export const AddMemoryForm: React.FC<AddMemoryFormProps> = ({ onAddMemory, onCancel }) => {
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [category, setCategory] = useState('family');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personName || !relationship || !imageUrl || (!voiceMessage && !recordedAudio)) {
      alert('Please fill in all fields and either record a voice message or enter text.');
      return;
    }

    const newMemory: Omit<Memory, 'id'> = {
      imageUrl,
      personName,
      relationship,
      category,
      voiceMessage: voiceMessage || `This is ${personName}, your ${relationship.toLowerCase()}. ${description}`,
      description
    };

    onAddMemory(newMemory);
    
    // Reset form
    setPersonName('');
    setRelationship('');
    setCategory('family');
    setDescription('');
    setImageUrl('');
    setVoiceMessage('');
    setAudioBlob(null);
    setRecordedAudio('');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Add New Memory</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Photo</Label>
            <div className="flex flex-col items-center space-y-4">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-48 h-48 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Person Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Person's Name</Label>
              <Input
                id="name"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g., Sarah"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g., Daughter"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="family">Family</option>
              <option value="events">Events</option>
              <option value="places">Places</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this memory..."
              rows={3}
            />
          </div>

          {/* Voice Recording */}
          <div className="space-y-4">
            <Label>Voice Message</Label>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isRecording ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
                
                {recordedAudio && (
                  <Button
                    type="button"
                    onClick={playRecording}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play Recording
                  </Button>
                )}
              </div>
              
              {isRecording && (
                <div className="text-red-500 font-medium animate-pulse">
                  Recording... Speak clearly about this memory
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voiceText">Or type voice message text:</Label>
              <Textarea
                id="voiceText"
                value={voiceMessage}
                onChange={(e) => setVoiceMessage(e.target.value)}
                placeholder="Type what you want the voice to say about this memory..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
              Add Memory
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
