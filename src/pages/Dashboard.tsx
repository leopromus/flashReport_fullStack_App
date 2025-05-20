import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Title,
  Group,
  Button,
  Tabs,
  Modal,
  Text,
  Stack,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconPlus, IconFlag, IconTools } from '@tabler/icons-react';
import ReportList from '../components/reports/ReportList';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchReports, deleteReport } from '../store/slices/reportSlice';
import type { Report } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const { reports } = useAppSelector((state) => state.reports);
  const [tabValue, setTabValue] = useState<string | null>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleTabChange = (value: string | null) => {
    setTabValue(value);
  };

  const handleCreateReport = () => {
    navigate('/create-report');
  };

  const handleDeleteClick = (report: Report) => {
    setSelectedReport(report);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReport) {
      await dispatch(deleteReport(selectedReport.id));
      setDeleteModalOpen(false);
    }
  };

  const redFlagReports = reports.filter((report) => report.type === 'RED_FLAG');
  const interventionReports = reports.filter(
    (report) => report.type === 'INTERVENTION'
  );

  return (
    <Container size="lg" py="md">
      <Card shadow="sm" p="lg" radius="md" withBorder mb={rem(24)}>
        <Group position="apart" align="center">
          <Title order={2}>Reports</Title>
          <Button
            leftSection={<IconPlus size={18} />}
            color="indigo"
            onClick={handleCreateReport}
            radius="md"
          >
            Create Report
          </Button>
        </Group>
      </Card>

      <Card shadow="sm" p="md" radius="md" withBorder>
        <Tabs value={tabValue} onChange={handleTabChange} color="indigo" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="all" icon={<IconFlag size={16} />}>
              All Reports
            </Tabs.Tab>
            <Tabs.Tab value="redflags" icon={<IconFlag size={16} color={theme.colors.red[6]} />}>
              Red Flags
            </Tabs.Tab>
            <Tabs.Tab value="interventions" icon={<IconTools size={16} color={theme.colors.blue[6]} />}>
              Interventions
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="md">
            <ReportList reports={reports} onDelete={handleDeleteClick} />
          </Tabs.Panel>
          <Tabs.Panel value="redflags" pt="md">
            <ReportList reports={redFlagReports} onDelete={handleDeleteClick} />
          </Tabs.Panel>
          <Tabs.Panel value="interventions" pt="md">
            <ReportList reports={interventionReports} onDelete={handleDeleteClick} />
          </Tabs.Panel>
        </Tabs>
      </Card>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete this report? This action cannot be undone.
          </Text>
          <Group position="right" mt="md">
            <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default Dashboard;