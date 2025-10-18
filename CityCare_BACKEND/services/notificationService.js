/**
 * Notification Service
 * Handles push notifications to mobile devices
 * 
 * Note: This is a basic implementation. In production, you would integrate
 * with services like Firebase Cloud Messaging (FCM) or Expo Notifications
 */

/**
 * Send push notification to a user
 * @param {string} pushToken - User's device push token
 * @param {object} notification - Notification data
 * @returns {Promise<boolean>} - Success status
 */
const sendPushNotification = async (pushToken, notification) => {
    try {
        // If no push token, skip notification
        if (!pushToken) {
            console.log('No push token available for user');
            return false;
        }

        /**
         * TODO: Integrate with your push notification service
         * 
         * For Firebase Cloud Messaging (FCM):
         * const admin = require('firebase-admin');
         * await admin.messaging().send({
         *   token: pushToken,
         *   notification: {
         *     title: notification.title,
         *     body: notification.body
         *   },
         *   data: notification.data
         * });
         * 
         * For Expo Notifications:
         * const { Expo } = require('expo-server-sdk');
         * let expo = new Expo();
         * await expo.sendPushNotificationsAsync([{
         *   to: pushToken,
         *   sound: 'default',
         *   title: notification.title,
         *   body: notification.body,
         *   data: notification.data,
         * }]);
         */

        // For now, just log the notification
        console.log('📱 Push Notification:', {
            to: pushToken,
            title: notification.title,
            body: notification.body,
            data: notification.data
        });

        return true;
    } catch (error) {
        console.error('Error sending push notification:', error);
        return false;
    }
};

/**
 * Send notification when report status changes
 * @param {object} report - Report object
 * @param {object} user - User who created the report
 * @param {string} newStatus - New status value
 */
const notifyReportStatusChange = async (report, user, newStatus) => {
    try {
        if (!user.pushToken) {
            return;
        }

        // Create notification message based on status
        let title = '';
        let body = '';

        switch (newStatus) {
            case 'EN_COURS':
                title = 'Signalement pris en charge';
                body = `Votre signalement "${report.title}" est maintenant en cours de traitement.`;
                break;
            case 'RESOLU':
                title = 'Signalement résolu';
                body = `Votre signalement "${report.title}" a été résolu. Merci pour votre contribution!`;
                break;
            case 'REJETE':
                title = 'Signalement rejeté';
                body = `Votre signalement "${report.title}" a été rejeté.`;
                break;
            default:
                return;
        }

        const notification = {
            title,
            body,
            data: {
                type: 'report_status_change',
                reportId: report._id.toString(),
                status: newStatus
            }
        };

        await sendPushNotification(user.pushToken, notification);
    } catch (error) {
        console.error('Error notifying report status change:', error);
    }
};

/**
 * Send notification when a comment is added to a report
 * @param {object} report - Report object
 * @param {object} reportOwner - User who created the report
 * @param {object} commenter - User who added the comment
 */
const notifyNewComment = async (report, reportOwner, commenter) => {
    try {
        if (!reportOwner.pushToken) {
            return;
        }

        // Don't notify if user comments on their own report
        if (reportOwner._id.toString() === commenter._id.toString()) {
            return;
        }

        const notification = {
            title: 'Nouveau commentaire',
            body: `${commenter.name} a commenté votre signalement "${report.title}"`,
            data: {
                type: 'new_comment',
                reportId: report._id.toString()
            }
        };

        await sendPushNotification(reportOwner.pushToken, notification);
    } catch (error) {
        console.error('Error notifying new comment:', error);
    }
};

/**
 * Send notification to admins when a new report is created
 * @param {object} report - Report object
 * @param {array} admins - Array of admin users
 */
const notifyAdminsNewReport = async (report, admins) => {
  try {
    const notification = {
      title: 'Nouveau signalement',
      body: `Un nouveau signalement a été créé: "${report.title}" - ${report.category}`,
      data: {
        type: 'new_report',
        reportId: report._id.toString(),
        category: report.category
      }
    };

    // Send to all admins with push tokens
    const promises = admins
      .filter(admin => admin.pushToken)
      .map(admin => sendPushNotification(admin.pushToken, notification));

    await Promise.all(promises);
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
};/**
 * Send welcome notification to new users
 * @param {object} user - User object
 */
const sendWelcomeNotification = async (user) => {
    try {
        if (!user.pushToken) {
            return;
        }

        const notification = {
            title: 'Bienvenue sur CityCare!',
            body: 'Merci de rejoindre notre communauté. Ensemble, améliorons notre ville!',
            data: {
                type: 'welcome'
            }
        };

        await sendPushNotification(user.pushToken, notification);
    } catch (error) {
        console.error('Error sending welcome notification:', error);
    }
};

module.exports = {
  sendPushNotification,
  notifyReportStatusChange,
  notifyNewComment,
  notifyAdminsNewReport,
  sendWelcomeNotification
};