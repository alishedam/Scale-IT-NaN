// @mui
import { Grid, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';
import WorkspaceInviteFriends from '../../sections/@dashboard/workspace/WorkspaceInviteFriends';

// ----------------------------------------------------------------------

export default function WorkspaceInvite() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Workspace: Invite Members">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Invite Members to your Workspace!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <WorkspaceInviteFriends />
          </Grid>

          <Grid item xs={12} md={12} lg={12}></Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsWidgetSummary title="Salary Total" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsWidgetSummary
              title="Workspace Members"
              total={1352831}
              color="info"
              icon={'ant-design:apple-filled'}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
