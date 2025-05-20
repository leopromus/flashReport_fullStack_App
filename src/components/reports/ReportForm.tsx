import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Alert,
  IconButton,
} from '@mui/material';
import { CloudUpload as UploadIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Report } from '../../types';
import { useAppSelector } from '../../hooks';
//import { fetchUsers } from '../../store/slices/userSlice';
import LocationPicker from '../map/LocationPicker';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  type: Yup.string()
    .oneOf(['RED_FLAG', 'INTERVENTION'], 'Invalid report type')
    .required('Report type is required'),
  location: Yup.string().required('Location is required'),
  comment: Yup.string().required('Comment is required'),
});

interface ReportFormProps {
  initialValues?: Partial<Report>;
  onSubmit: (values: Partial<Report>) => void;
  isLoading: boolean;
  error?: string | null;
}

const ReportForm = ({
  initialValues,
  onSubmit,
  isLoading,
  error,
}: ReportFormProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Clean up preview URLs when component unmounts
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImages(prev => [...prev, ...files]);

      // Create preview URLs for new images
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedVideos(prev => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Prevent admins from creating reports
  if (user?.role === 'ADMIN') {
    return (
      <Typography color="error" variant="h6" align="center">
        Administrators cannot create new reports. This functionality is reserved for regular users only.
      </Typography>
    );
  }

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      type: initialValues?.type || 'RED_FLAG',
      location: initialValues?.location || '',
      comment: initialValues?.comment || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // Convert File[] to string[] (e.g., using object URLs)
      const imageUrls = selectedImages.map((file) => URL.createObjectURL(file));
      const videoUrls = selectedVideos.map((file) => URL.createObjectURL(file));
      const formData = {
        ...values,
        images: imageUrls,
        videos: videoUrls,
      };
      onSubmit(formData);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="type-label">Report Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formik.values.type}
              label="Report Type"
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="RED_FLAG">Red Flag (Corruption)</MenuItem>
              <MenuItem value="INTERVENTION">Intervention</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Location
            </Typography>
            <LocationPicker
              value={formik.values.location}
              onChange={(location) => formik.setFieldValue('location', location)}
            />
            {formik.touched.location && formik.errors.location && (
              <Typography color="error" variant="caption">
                {formik.errors.location}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="comment"
            name="comment"
            label="Comment"
            multiline
            rows={4}
            value={formik.values.comment}
            onChange={formik.handleChange}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Images
          </Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
            >
              Upload Images
            </Button>
          </label>
          {selectedImages.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {previewUrls.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Videos
          </Typography>
          <input
            accept="video/*"
            style={{ display: 'none' }}
            id="video-upload"
            multiple
            type="file"
            onChange={handleVideoChange}
          />
          <label htmlFor="video-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
            >
              Upload Videos
            </Button>
          </label>
          {selectedVideos.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {selectedVideos.map((video, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" noWrap>
                    {video.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveVideo(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading
              ? 'Submitting...'
              : initialValues
              ? 'Update Report'
              : 'Create Report'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportForm; 