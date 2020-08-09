import { Requester } from '../../Requester/interface';
import Datetime from '../../Helper/Datetime';
import { Video, VideoListResult, Credential } from '../interface';

class TwitchFetcher {
  data: any[] = [];
  token: string | null = null;

  constructor(public credential: Credential, public requester: Requester) {}

  async fetch(type: string, ...params: any): Promise<any> {
    switch (type) {
      case 'getUserIdFromUsername':
        const [username] = params;
        return this.getUserIdFromUsername(username);
      case 'getVideos':
        const [userId, since, until] = params;
        return this.getVideos(userId, since, until);
    }
  }

  async setToken() {
    const grantType = 'client_credentials';
    const scope = ['channel_feed_read'].join('_');
    const endpoint = [
      `https://id.twitch.tv/oauth2/token?client_id=${this.credential.clientId}`,
      `&client_secret=${this.credential.clientSecret}&grant_type=${grantType}&scope=${scope}`,
    ].join('');

    const response = await this.requester.post(endpoint, {}, {});

    if (response && response.data && response.data.access_token) {
      this.token = response.data.access_token;
    }
  }

  async getUserIdFromUsername(username: string): Promise<string | null> {
    if (this.token === null) {
      await this.setToken();
    }

    const endpoint = `https://api.twitch.tv/helix/users?login=${username}`;
    const response = await this.requester.get(endpoint, {
      'Client-ID': this.credential.clientId,
      Authorization: `Bearer ${this.token}`,
    });

    let userId: string | null = null;

    if (
      response &&
      response.data &&
      response.data.data &&
      response.data.data[0].id
    ) {
      userId = response.data.data[0].id;
    }

    return userId;
  }

  async getVideos(
    userId: string,
    since: string,
    until: string
  ): Promise<Video[]> {
    const limit: number = 100;
    const resultLimit: number = 1000;

    let resultVideos: Video[] = [];
    let stop: boolean = false;
    let url: string | null = null;

    while (!stop) {
      const videos: VideoListResult = await this.getVideosFromUserId(
        userId,
        url,
        limit
      );
      const data: Video[] = videos.data;
      const next: string | null = videos.next;

      if (data.length > 0) {
        let videoPublishedAt: string | null = null;

        const formattedVideo = data.filter((video) => {
          videoPublishedAt = video.published_at || null;

          return videoPublishedAt &&
            Datetime.isBetween(videoPublishedAt, since, until)
            ? video
            : false;
        });

        if (
          videoPublishedAt === null ||
          Datetime.isBefore(videoPublishedAt, since) ||
          resultVideos.length > resultLimit
        ) {
          stop = true;
        } else {
          url = next;
        }

        resultVideos.push(...formattedVideo);
      } else {
        stop = true;
      }
    }

    return resultVideos;
  }

  async getVideosFromUserId(
    userId: string,
    url: string | null = null,
    limit: number
  ): Promise<VideoListResult> {
    if (this.token === null) {
      await this.setToken();
    }

    const _endpoint = `https://api.twitch.tv/helix/videos?user_id=${userId}&first=${limit}`;
    const endpoint = url !== null ? url : _endpoint;
    const response = await this.requester.get(endpoint, {
      'Client-ID': this.credential.clientId,
      Authorization: `Bearer ${this.token}`,
    });

    let data: Video[] = [];
    let next: string | null = null;

    if (response && response.data && response.data.data) {
      data = response.data.data;
    }

    if (
      response &&
      response.data.pagination &&
      response.data.pagination.cursor
    ) {
      next = `${_endpoint}&after=${response.data.pagination.cursor}`;
    }

    return { data, next };
  }
}

export default TwitchFetcher;
