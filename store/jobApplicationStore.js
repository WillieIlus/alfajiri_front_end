// stores/jobApplicationStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useJobApplicationStore = defineStore('jobApplication', {
  state: () => ({
    isSubmitting: false,
    error: null,
  }),

  actions: {
    async applyForJob({ jobId, employerEmail, resume, coverLetter }) {
      this.isSubmitting = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append('job_id', jobId);
        formData.append('employer_email', employerEmail);
        if (resume) formData.append('resume', resume);
        if (coverLetter) formData.append('cover_letter', coverLetter);

        const response = await axios.post('/api/job-applications/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.isSubmitting = false;
        return response.data;
      } catch (error) {
        this.isSubmitting = false;
        this.error = error.response?.data?.message || 'An error occurred while submitting your application.';
        throw error;
      }
    },
  },
});