import PropTypes from 'prop-types';

// hooks
import { useState } from 'react';
import { useTheme } from '@emotion/react';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, CardContent, Button, Link } from '@mui/material';

//react router link
import { Link as RouterLink } from 'react-router-dom';

// utils
import cssStyles from '../../../utils/cssStyles';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import Label from 'src/components/Label';
import { sentenceCase } from 'change-case';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MoreProjectOptions from './MoreProjectOptions';
import { fDate } from 'src/utils/formatTime';

// ----------------------------------------------------------------------
const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));
// ----------------------------------------------------------------------

ProjectItem.propTypes = {
  project: PropTypes.object,
};

export default function ProjectItem({
  project,
  userId,
  workspaceId,
  deleteProjectHook,
  updateProjectHook,
  restoreProjectHook,
  isProjectManager,
}) {
  const { description, name, startDate, expectedEndDate, _id, workspace, isDeleted } = project;
  const theme = useTheme();
  const [projectId, setProjectId] = useState(_id);

  const isLight = theme.palette.mode === 'light';
  const now = new Date();
  const expectedEndDateJs = new Date(expectedEndDate);
  const projectCompleted = expectedEndDateJs.getTime() < now.getTime();
  const color = projectCompleted ? 'error' : 'in_progress' && 'warning';
  const linkTo = `${PATH_DASHBOARD.workspaces.details}${workspaceId}/project/${projectId}`;

  const handleRestore = () => restoreProjectHook({ projectId: projectId, workspaceId: workspaceId, memberId: userId });

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery image" ratio="1/1" src={''} />
      {isDeleted ? (
        <Label
          sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
          variant={isLight ? 'ghost' : 'filled'}
          color="error"
        >
          {sentenceCase('deleted')}
        </Label>
      ) : (
        <Label
          sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
          variant={isLight ? 'ghost' : 'filled'}
          color={color}
        >
          {projectCompleted ? sentenceCase('overdue') : sentenceCase('in progress')}
        </Label>
      )}

      <CaptionStyle>
        <div>
          {isDeleted ? (
            <Typography variant="subtitle1">{name}</Typography>
          ) : (
            <Link to={linkTo} color="inherit" component={RouterLink}>
              <Typography variant="subtitle1">{name}</Typography>
            </Link>
          )}
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Due Date
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDate(expectedEndDateJs)}
          </Typography>
        </div>
        {isDeleted ? (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Iconify icon={'eva:heart-fill'} width={20} height={20} />}
            onClick={handleRestore}
          >
            Restore
          </Button>
        ) : (
          <MoreProjectOptions
            deleteProjectHook={deleteProjectHook}
            updateProjectHook={updateProjectHook}
            userId={userId}
            projectId={projectId}
            project={project}
            workspaceId={workspaceId}
            linkTo={linkTo}
            isProjectManager={isProjectManager}
          />
        )}
      </CaptionStyle>
    </Card>
  );
}
